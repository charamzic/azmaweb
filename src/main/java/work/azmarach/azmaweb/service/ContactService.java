package work.azmarach.azmaweb.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import work.azmarach.azmaweb.dto.ContactFormDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.mail.MailException;
import jakarta.annotation.PostConstruct;

@Service
public class ContactService {

    private static final Logger logger = LoggerFactory.getLogger(ContactService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${contact.email.to:}")
    private String toEmail;

    @Value("${contact.email.from:}")
    private String fromEmail;

    @Value("${contact.email.enabled:false}")
    private boolean emailEnabled;

    @PostConstruct
    public void validateConfiguration() {
        if (emailEnabled) {
            if (toEmail == null || toEmail.trim().isEmpty()) {
                logger.error("CONTACT_EMAIL_TO environment variable is required when email is enabled");
                throw new IllegalStateException("Missing required environment variable: CONTACT_EMAIL_TO");
            }

            if (fromEmail == null || fromEmail.trim().isEmpty()) {
                logger.error("CONTACT_EMAIL_FROM environment variable is required when email is enabled");
                throw new IllegalStateException("Missing required environment variable: CONTACT_EMAIL_FROM");
            }

            if (mailSender == null) {
                logger.error("JavaMailSender is not configured. Check your mail properties.");
                throw new IllegalStateException("Mail configuration is incomplete");
            }

            if (!isValidEmail(toEmail)) {
                logger.error("Invalid CONTACT_EMAIL_TO format: {}", toEmail);
                throw new IllegalStateException("Invalid email format for CONTACT_EMAIL_TO");
            }

            if (!isValidEmail(fromEmail)) {
                logger.error("Invalid CONTACT_EMAIL_FROM format: {}", fromEmail);
                throw new IllegalStateException("Invalid email format for CONTACT_EMAIL_FROM");
            }

            logger.info("Email configuration validated successfully - To: {}, From: {}",
                    maskEmail(toEmail), maskEmail(fromEmail));
        } else {
            logger.info("Email functionality is disabled - contact forms will be logged only");
        }
    }

    public void processContactForm(ContactFormDto contactForm) {
        String correlationId = java.util.UUID.randomUUID().toString().substring(0, 8);
        MDC.put("correlationId", correlationId);

        try {
            logger.info("Processing contact form submission - From: {} <{}>, Subject: '{}'",
                    contactForm.getName(), contactForm.getEmail(), contactForm.getSubject());

            if (emailEnabled && mailSender != null) {
                sendEmailWithManualRetry(contactForm);
                logger.info("Contact form processed successfully - Email sent to: {}", maskEmail(toEmail));
            } else {
                logContactMessage(contactForm);
                logger.info("Contact form processed successfully - Email disabled, message logged");
            }
        } catch (Exception e) {
            logger.error("Failed to process contact form - From: {} <{}>, Error: {}",
                    contactForm.getName(), contactForm.getEmail(), e.getMessage(), e);
            throw e;
        } finally {
            MDC.clear();
        }
    }

    private void sendEmailWithManualRetry(ContactFormDto contactForm) {
        int maxAttempts = 3;
        int attempt = 0;
        long delay = 1000;

        while (attempt < maxAttempts) {
            try {
                attempt++;
                logger.debug("Email send attempt {} of {}", attempt, maxAttempts);

                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(toEmail);
                message.setSubject("Portfolio Contact: " + contactForm.getSubject());
                message.setText(formatEmailBody(contactForm));
                message.setReplyTo(contactForm.getEmail());

                long startTime = System.currentTimeMillis();
                mailSender.send(message);
                long duration = System.currentTimeMillis() - startTime;

                logger.info("Email sent successfully - Duration: {}ms, To: {}, Reply-To: {}, Attempt: {}",
                        duration, maskEmail(toEmail), contactForm.getEmail(), attempt);
                return;

            } catch (MailException e) {
                logger.warn("Email send attempt {} failed: {}", attempt, e.getMessage());

                if (attempt >= maxAttempts) {
                    logger.error("All {} email send attempts failed. Final error: {}", maxAttempts, e.getMessage());
                    throw new RuntimeException("Failed to send email after " + maxAttempts + " attempts", e);
                }

                try {
                    Thread.sleep(delay);
                    delay *= 2;
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Email sending interrupted", ie);
                }
            }
        }
    }

    private void logContactMessage(ContactFormDto contactForm) {
        logger.info("=== CONTACT FORM SUBMISSION (Email Disabled) ===");
        logger.info("From: {} <{}>", contactForm.getName(), contactForm.getEmail());
        logger.info("Subject: {}", contactForm.getSubject());
        logger.info("Message Length: {} characters", contactForm.getMessage().length());
        logger.info("Message Preview: {}",
                contactForm.getMessage().length() > 100
                        ? contactForm.getMessage().substring(0, 100) + "..."
                        : contactForm.getMessage());
        logger.info("================================================");
    }

    private String formatEmailBody(ContactFormDto contactForm) {
        return String.format("""
            New contact form submission from azmarach.work
            
            Name: %s
            Email: %s
            Subject: %s
            
            Message:
            %s
            
            ---
            Sent at: %s
            Reply directly to this email to respond to the sender.
            """,
                contactForm.getName(),
                contactForm.getEmail(),
                contactForm.getSubject(),
                contactForm.getMessage(),
                java.time.LocalDateTime.now().toString()
        );
    }

    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return "***";
        }
        String[] parts = email.split("@");
        String localPart = parts[0];
        String domain = parts[1];

        if (localPart.length() <= 2) {
            return "**@" + domain;
        }

        return localPart.charAt(0) + "***" + localPart.charAt(localPart.length() - 1) + "@" + domain;
    }
}