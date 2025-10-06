package work.azmarach.azmaweb.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Locale;

@Controller
public class HomeController {

    @Autowired
    private MessageSource messageSource;

    @GetMapping("/")
    public String home(Model model, HttpServletRequest request, Locale locale) {
        model.addAttribute("pageTitle", messageSource.getMessage("page.title.home", null, locale));
        model.addAttribute("currentUri", request.getRequestURI());
        return "index";
    }

    @GetMapping("/about")
    public String about(Model model, HttpServletRequest request, Locale locale) {
        model.addAttribute("pageTitle", messageSource.getMessage("page.title.about", null, locale));
        model.addAttribute("currentUri", request.getRequestURI());
        return "about";
    }

    @GetMapping("/projects")
    public String projects(Model model, HttpServletRequest request, Locale locale) {
        model.addAttribute("pageTitle", messageSource.getMessage("page.title.projects", null, locale));
        model.addAttribute("currentUri", request.getRequestURI());
        return "projects";
    }

    // @GetMapping("/blog")
    // public String blog(Model model, HttpServletRequest request, Locale locale) {
    //     model.addAttribute("pageTitle", messageSource.getMessage("page.title.blog", null, locale));
    //     model.addAttribute("currentUri", request.getRequestURI());
    //     return "blog";
    // }

    @GetMapping("/contact")
    public String contact(Model model, HttpServletRequest request, Locale locale) {
        model.addAttribute("pageTitle", messageSource.getMessage("page.title.contact", null, locale));
        model.addAttribute("currentUri", request.getRequestURI());
        return "contact";
    }

    private String formatProjectName(String projectName) {
        String formatted = projectName.replace("-", " ")
                .replace("_", " ");

        StringBuilder result = new StringBuilder();
        boolean capitalizeNext = true;

        for (char c : formatted.toCharArray()) {
            if (Character.isWhitespace(c)) {
                capitalizeNext = true;
                result.append(c);
            } else if (capitalizeNext) {
                result.append(Character.toUpperCase(c));
                capitalizeNext = false;
            } else {
                result.append(Character.toLowerCase(c));
            }
        }

        return result.toString();
    }
}
