# AzmaWeb - Professional Portfolio

A modern, responsive portfolio website built with Spring Boot and Thymeleaf, featuring a professional design, multilingual support, and a fully functional contact form with anti-spam protection.

🌐 **Live Demo:** [azmarach.work](https://azmarach.work)

## ✨ Features

- **📱 Responsive Design** - Mobile-first approach with modern CSS Grid and Flexbox
- **🌍 Multilingual Support** - Czech and English translations
- **📧 Contact Form** - Functional email sending with anti-spam protection
- **🛡️ Security** - Rate limiting, honeypot fields, and content-based spam detection
- **⚡ Performance** - Optimized with compression, caching, and HTTP/2
- **📊 Monitoring** - Spring Boot Actuator with health checks and metrics
- **🎨 Modern UI** - Custom fonts (League Gothic + Source Code Pro), gradient backgrounds
- **🔒 Production Ready** - Proper logging, error handling, and security headers

## 🛠️ Technologies Used

### **Backend**
- **Spring Boot 3.x** - Main framework
- **Spring MVC** - Web layer
- **Spring Security** - Security configuration
- **Spring Mail** - Email functionality
- **Thymeleaf** - Template engine
- **Bean Validation** - Form validation
- **Lombok** - Boilerplate reduction

### **Frontend**
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid/Flexbox
- **JavaScript ES6+** - Interactive functionality
- **Custom Fonts** - League Gothic & Source Code Pro
- **Responsive Design** - Mobile-first approach

### **Infrastructure**
- **Railway** - Cloud hosting platform
- **Cloudflare** - CDN and DNS management
- **Gmail SMTP** - Email delivery
- **Environment Variables** - Secure configuration

### **Monitoring & Logging**
- **Spring Boot Actuator** - Health checks and metrics
- **SLF4J + Logback** - Structured logging
- **Correlation IDs** - Request tracing

## 🚀 Getting Started

### **Prerequisites**
- Java 17+
- Maven 3.6+
- Gmail account with App Password (for email functionality)

### **Local Development**

1. **Clone the repository**
   ```bash
   git clone https://github.com/charamzic/azmaweb.git
   cd azmaweb
   ```

2. **Create environment file**
   ```bash
   # Create .env file in project root
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-16-digit-app-password
   CONTACT_EMAIL_TO=your-email@gmail.com
   CONTACT_EMAIL_FROM=your-email@gmail.com
   CONTACT_EMAIL_ENABLED=true
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

4. **Access the application**
   - Website: http://localhost:8080
   - Health check: http://localhost:8080/actuator/health

### **Configuration Profiles**

The application supports multiple profiles:

- **`default`** - Basic configuration
- **`development`** - Development settings (hot reload, debug logging)
- **`production`** - Production optimizations (caching, security headers)
- **`railway`** - Railway-specific configuration

```bash
# Run with specific profile
mvn spring-boot:run -Dspring.profiles.active=development
```

## 📧 Email Configuration

### **Gmail Setup**
1. Enable 2-Factor Authentication
2. Generate App Password: Google Account → Security → App passwords
3. Use the 16-digit password in your `.env` file

### **Alternative SMTP Providers**
The application supports any SMTP provider. Update `application.properties`:
```properties
spring.mail.host=smtp.your-provider.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
```

## 🛡️ Security Features

### **Anti-Spam Protection**
- **Rate Limiting** - 3 submissions per 15 minutes per IP
- **Honeypot Fields** - Hidden fields to catch bots
- **Content Analysis** - Spam keyword detection
- **Input Validation** - Server-side validation for all fields

### **Security Headers**
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff

## 📊 Monitoring

### **Health Checks**
```bash
curl https://azmarach.work/actuator/health
```

### **Application Metrics**
```bash
# JVM Memory
curl https://azmarach.work/actuator/metrics/jvm.memory.used

# HTTP Requests
curl https://azmarach.work/actuator/metrics/http.server.requests
```

### **Application Info**
```bash
curl https://azmarach.work/actuator/info
```

## 🌐 Deployment

### **Railway Deployment**
1. Connect GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on git push

### **Environment Variables for Production**
```bash
MAIL_USERNAME=your@email.com
MAIL_PASSWORD=your-app-password
CONTACT_EMAIL_ENABLED=true
CONTACT_EMAIL_TO=your@email.com
CONTACT_EMAIL_FROM=your@email.com
```

## 📝 Project Structure

```
src/
├── main/
│   ├── java/work/azmarach/azmaweb/
│   │   ├── config/               # Security, I18n configuration
│   │   ├── controller/           # Web and API controllers
│   │   ├── dto/                  # Data transfer objects
│   │   └── service/              # Business logic services
│   ├── resources/
│   │   ├── static/               # CSS, JavaScript, images
│   │   ├── templates/            # Thymeleaf templates
│   │   └── messages*.properties  # Internationalization
└── test/                         # Unit and integration tests
```

## 🎨 Customization

### **Colors & Branding**
Update CSS variables in `style.css`:
```css
:root {
  --primary-color: #9d4edd;
  --primary-light: #c77dff;
  --primary-dark: #7209b7;
}
```

### **Content & Translations**
- Update `messages.properties` (English)
- Update `messages_cs.properties` (Czech)
- Modify Thymeleaf templates in `templates/`

## 🔧 Development

### **Adding New Languages**
1. Create `messages_[lang].properties`
2. Add language to `I18nConfig.java`
3. Update language switcher in `layout.html`

### **Custom Email Templates**
Modify `ContactService.formatEmailBody()` method

### **Adding New Pages**
1. Create Thymeleaf template in `templates/`
2. Add controller method in `HomeController.java`
3. Update navigation in `layout.html`

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Jan Charamza**
- Website: [azmarach.work](https://azmarach.work)
- GitHub: [@charamzic](https://github.com/charamzic)
- LinkedIn: [charamzic](https://linkedin.com/in/charamzic)
- Email: charamza@gmail.com

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/charamzic/azmaweb/issues).

---

⭐ **Star this repository if you found it helpful!**