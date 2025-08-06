package work.azmarach.azmaweb.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LegalController {

    @GetMapping("/privacy-policy")
    public String privacyPolicy() {
        return "privacy-policy";
    }

    @GetMapping("/privacy")
    public String privacyRedirect() {
        return "redirect:/privacy-policy";
    }

    @GetMapping("/terms-of-use")
    public String termsOfUse() {
        return "terms-of-use";
    }

    @GetMapping("/terms")
    public String termsRedirect() {
        return "redirect:/terms-of-use";
    }

    @GetMapping("/cookie-notice")
    public String cookieNotice() {
        return "cookie-notice";
    }

    @GetMapping("/cookies")
    public String cookiesRedirect() {
        return "redirect:/cookie-notice";
    }
}