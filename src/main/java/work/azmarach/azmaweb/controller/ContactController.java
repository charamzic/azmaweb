package work.azmarach.azmaweb.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import work.azmarach.azmaweb.dto.ContactFormDto;
import work.azmarach.azmaweb.service.ContactService;
import work.azmarach.azmaweb.service.RateLimitService;
import work.azmarach.azmaweb.service.SpamDetectionService;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ContactController {

    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);

    @Autowired
    private ContactService contactService;

    @Autowired
    private RateLimitService rateLimitService;

    @Autowired
    private SpamDetectionService spamDetectionService;

    @PostMapping("/contact")
    public ResponseEntity<Map<String, Object>> submitContactForm(
            @Valid @RequestBody ContactFormDto contactForm,
            HttpServletRequest request) {

        String clientIp = getClientIpAddress(request);
        logger.info("Contact form submission from IP: {}", clientIp);

        try {
            if (rateLimitService.isRateLimited(clientIp)) {
                logger.warn("Rate limit exceeded for IP: {}", clientIp);
                return ResponseEntity.status(429).body(Map.of(
                        "success", false,
                        "message", "Too many requests. Please try again later."
                ));
            }

            if (contactForm.getWebsite() != null && !contactForm.getWebsite().trim().isEmpty()) {
                logger.warn("Honeypot triggered for IP: {} - Bot detected", clientIp);
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Message sent successfully!"
                ));
            }

            if (spamDetectionService.isSpam(contactForm)) {
                logger.warn("Spam detected from IP: {} - Content: {}", clientIp, contactForm.getSubject());
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Message appears to be spam. Please review your content."
                ));
            }

            contactService.processContactForm(contactForm);

            int remainingAttempts = rateLimitService.getRemainingAttempts(clientIp);
            logger.info("Form processed successfully. Remaining attempts for IP {}: {}", clientIp, remainingAttempts);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Message sent successfully!"
            ));

        } catch (Exception e) {
            logger.error("Error processing contact form from IP: {}", clientIp, e);
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "An error occurred. Please try again later."
            ));
        }
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }
}