package work.azmarach.azmaweb.service;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
public class RateLimitService {

    private final Map<String, RateLimitInfo> rateLimitMap = new ConcurrentHashMap<>();

    private static final int MAX_ATTEMPTS = 3;
    private static final int WINDOW_MINUTES = 15;

    public boolean isRateLimited(String clientIp) {
        cleanExpiredEntries();

        RateLimitInfo info = rateLimitMap.computeIfAbsent(clientIp, k -> new RateLimitInfo());

        LocalDateTime now = LocalDateTime.now();

        if (info.windowStart.isBefore(now.minusMinutes(WINDOW_MINUTES))) {
            info.attempts = 0;
            info.windowStart = now;
        }

        if (info.attempts >= MAX_ATTEMPTS) {
            return true;
        }

        info.attempts++;
        return false;
    }

    public int getRemainingAttempts(String clientIp) {
        RateLimitInfo info = rateLimitMap.get(clientIp);
        if (info == null) {
            return MAX_ATTEMPTS;
        }

        LocalDateTime now = LocalDateTime.now();
        if (info.windowStart.isBefore(now.minus(WINDOW_MINUTES, ChronoUnit.MINUTES))) {
            return MAX_ATTEMPTS;
        }

        return Math.max(0, MAX_ATTEMPTS - info.attempts);
    }

    private void cleanExpiredEntries() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(WINDOW_MINUTES);
        rateLimitMap.entrySet().removeIf(entry ->
                entry.getValue().windowStart.isBefore(cutoff));
    }

    private static class RateLimitInfo {
        int attempts = 0;
        LocalDateTime windowStart = LocalDateTime.now();
    }
}