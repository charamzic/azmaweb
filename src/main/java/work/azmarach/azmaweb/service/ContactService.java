package work.azmarach.azmaweb.service;

import kong.unirest.HttpResponse;
import kong.unirest.JsonNode;
import kong.unirest.Unirest;
import kong.unirest.UnirestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import work.azmarach.azmaweb.dto.ContactFormDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import jakarta.annotation.PostConstruct;

@Service
public class ContactService {

    private static final Logger logger = LoggerFactory.getLogger(ContactService.class);

    @Value("${mailgun.api.key:}")
    private String mailgunApiKey;

    @Value("${mailgun.domain:mg.azmarach.work}")
    private String mailgunDomain;

    @Value("${contact.email.to:}")
    private String toEmail;

    @Value("${contact.email.from:Mailgun Sandbox <postmaster@mg.azmarach.work>}")
    private String fromEmail;

    @Value("${contact.email.enabled:false}")
    private boolean emailEnabled;

    private static final String MAILGUN_API_BASE = "https://api.eu.mailgun.net/v3";

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

            if (mailgunApiKey == null || mailgunApiKey.trim().isEmpty()) {
                logger.error("MAILGUN_API_KEY environment variable is required when email is enabled");
                throw new IllegalStateException("Missing required environment variable: MAILGUN_API_KEY");
            }

            if (mailgunDomain == null || mailgunDomain.trim().isEmpty()) {
                logger.error("MAILGUN_DOMAIN environment variable is required when email is enabled");
                throw new IllegalStateException("Missing required environment variable: MAILGUN_DOMAIN");
            }

            String extractedToEmail = extractEmailFromNameFormat(toEmail);
            String extractedFromEmail = extractEmailFromNameFormat(fromEmail);

            if (isInvalidEmail(extractedToEmail)) {
                logger.error("Invalid CONTACT_EMAIL_TO format: {}", toEmail);
                throw new IllegalStateException("Invalid email format for CONTACT_EMAIL_TO");
            }

            if (isInvalidEmail(extractedFromEmail)) {
                logger.error("Invalid CONTACT_EMAIL_FROM format: {}", fromEmail);
                throw new IllegalStateException("Invalid email format for CONTACT_EMAIL_FROM");
            }

            logger.info("Email configuration validated successfully - To: {}, From: {}, Domain: {}",
                    maskEmail(extractedToEmail), maskEmail(extractedFromEmail), mailgunDomain);
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

            if (emailEnabled) {
                sendEmailWithMailgun(contactForm);
                logger.info("Contact form processed successfully - Email sent to: {}", maskEmail(extractEmailFromNameFormat(toEmail)));
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

    private void sendEmailWithMailgun(ContactFormDto contactForm) {
        int maxAttempts = 3;
        int attempt = 0;
        long delay = 1000;

        while (attempt < maxAttempts) {
            try {
                attempt++;
                logger.debug("Email send attempt {} of {}", attempt, maxAttempts);

                String apiUrl = MAILGUN_API_BASE + "/" + mailgunDomain + "/messages";

                HttpResponse<JsonNode> response = Unirest.post(apiUrl)
                        .basicAuth("api", mailgunApiKey)
                        .queryString("from", fromEmail)
                        .queryString("to", toEmail)
                        .queryString("subject", "Portfolio Contact: " + contactForm.getSubject())
                        .queryString("text", formatEmailBody(contactForm))
                        .queryString("h:Reply-To", contactForm.getEmail())
                        .asJson();

                if (response.getStatus() == 200) {
                    JsonNode responseBody = response.getBody();
                    String messageId = responseBody.getObject().optString("id", "unknown");

                    logger.info("Email sent successfully - Status: {}, MessageID: {}, To: {}, Reply-To: {}, Attempt: {}",
                            response.getStatus(), messageId, maskEmail(extractEmailFromNameFormat(toEmail)),
                            contactForm.getEmail(), attempt);
                    return;
                } else {
                    String errorMessage = "Unknown error";
                    if (response.getBody() != null && response.getBody().getObject().has("message")) {
                        errorMessage = response.getBody().getObject().getString("message");
                    }

                    logger.warn("Email send attempt {} failed with status: {}, Error: {}",
                            attempt, response.getStatus(), errorMessage);
                    throw new RuntimeException("Failed to send email with status: " + response.getStatus() + " - " + errorMessage);
                }

            } catch (UnirestException e) {
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
            } catch (Exception e) {
                logger.warn("Email send attempt {} failed with unexpected error: {}", attempt, e.getMessage());

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

    private boolean isInvalidEmail(String email) {
        return email == null || !email.matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
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

    /**
     * Extracts email address from "Name <email>" format
     * Returns the input unchanged if it's already just an email
     */
    private String extractEmailFromNameFormat(String emailString) {
        if (emailString == null) {
            return null;
        }

        int startBracket = emailString.lastIndexOf('<');
        int endBracket = emailString.lastIndexOf('>');

        if (startBracket != -1 && endBracket != -1 && startBracket < endBracket) {
            return emailString.substring(startBracket + 1, endBracket).trim();
        }

        return emailString.trim();
    }
}