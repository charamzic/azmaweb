package work.azmarach.azmaweb.service;

import org.springframework.stereotype.Service;
import work.azmarach.azmaweb.dto.ContactFormDto;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class SpamDetectionService {

    private static final List<String> SPAM_KEYWORDS = Arrays.asList(
            "viagra", "cialis", "pharmacy", "bitcoin", "cryptocurrency", "casino",
            "lottery", "winner", "congratulations", "million dollars", "inheritance",
            "prince", "loan", "credit", "debt", "seo services", "buy now", "click here",
            "make money", "work from home", "get rich", "guaranteed", "limited time",
            "act now", "urgent", "immediate", "free money", "investment opportunity"
    );

    private static final Pattern URL_PATTERN = Pattern.compile(
            "https?://[\\w\\-]+(\\.[\\w\\-]+)+([\\w\\-.,@?^=%&:/~+#]*[\\w\\-@?^=%&/~+#])?",
            Pattern.CASE_INSENSITIVE
    );

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
            Pattern.CASE_INSENSITIVE
    );

    public boolean isSpam(ContactFormDto contactForm) {
        String fullText = (contactForm.getSubject() + " " + contactForm.getMessage() + " " + contactForm.getName()).toLowerCase();

        long spamKeywordCount = SPAM_KEYWORDS.stream()
                .mapToLong(keyword -> countOccurrences(fullText, keyword))
                .sum();

        if (spamKeywordCount >= 2) {
            return true;
        }

        long urlCount = URL_PATTERN.matcher(contactForm.getMessage()).results().count();
        if (urlCount > 2) {
            return true;
        }

        long emailCount = EMAIL_PATTERN.matcher(contactForm.getMessage()).results().count();
        if (emailCount > 1) {
            return true;
        }

        if (hasExcessiveCapitalization(contactForm.getMessage())) {
            return true;
        }

        if (hasExcessiveRepetition(fullText)) {
            return true;
        }

        if (contactForm.getMessage().length() > 500 && getUniqueWordRatio(contactForm.getMessage()) < 0.3) {
            return true;
        }

        return false;
    }

    private long countOccurrences(String text, String keyword) {
        return Arrays.stream(text.split("\\s+"))
                .mapToLong(word -> word.contains(keyword) ? 1 : 0)
                .sum();
    }

    private boolean hasExcessiveCapitalization(String text) {
        if (text.length() < 20) return false;

        long upperCaseCount = text.chars()
                .filter(Character::isUpperCase)
                .count();

        double upperCaseRatio = (double) upperCaseCount / text.length();
        return upperCaseRatio > 0.6; // More than 60% uppercase
    }

    private boolean hasExcessiveRepetition(String text) {
        Pattern repetitionPattern = Pattern.compile("(.)\\1{4,}");
        return repetitionPattern.matcher(text).find();
    }

    private double getUniqueWordRatio(String text) {
        String[] words = text.toLowerCase().split("\\s+");
        if (words.length == 0) return 1.0;

        long uniqueWords = Arrays.stream(words)
                .distinct()
                .count();

        return (double) uniqueWords / words.length;
    }
}