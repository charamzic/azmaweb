# AzmaWeb - Professional Portfolio

A modern, responsive portfolio website built with Spring Boot and Thymeleaf, featuring a professional design, multilingual support, and a fully functional contact form with anti-spam protection.

🌐 **Live Demo:** [azmarach.work](https://azmarach.work)

## ✨ Features

- **📱 Responsive Design** - Mobile-first approach with modern CSS Grid and Flexbox
- **🌍 Multilingual Support** - Czech and English translations
- **📧 Contact Form** - Functional email sending with Mailgun integration and anti-spam protection
- **🛡️ Security** - Rate limiting, honeypot fields, and content-based spam detection
- **⚡ Performance** - Optimized with compression, caching, and HTTP/2
- **📊 Monitoring** - Spring Boot Actuator with health checks and metrics
- **🎨 Modern UI** - Custom fonts (League Gothic + Source Code Pro), gradient backgrounds
- **🔒 Production Ready** - Proper logging, error handling, and security headers
- **🔄 Retry Logic** - Email sending with exponential backoff and failure handling

## 🛠️ Technologies Used

### **Backend**
- **Spring Boot 3.x** - Main framework
- **Spring MVC** - Web layer
- **Spring Security** - Security configuration
- **Mailgun API** - Professional email delivery service
- **Unirest HTTP Client** - API communication
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
- **Mailgun** - Transactional email service
- **Environment Variables** - Secure configuration

### **Monitoring & Logging**
- **Spring Boot Actuator** - Health checks and metrics
- **SLF4J + Logback** - Structured logging
- **Correlation IDs** - Request tracing
- **MDC Context** - Request correlation and tracing

## 🚀 Getting Started

### **Prerequisites**
- Java 17+
- Maven 3.6+
- Mailgun account with verified domain

### **Local Development**

1. **Clone the repository**
   ```bash
   git clone https://github.com/charamzic/azmaweb.git
   cd azmaweb
   ```

2. **Set up Mailgun**
   - Create account at [mailgun.com](https://mailgun.com)
   - Add and verify your domain (e.g., `mg.yourdomain.com`)
   - Get your API key from the Mailgun dashboard

3. **Create environment file**
   ```bash
   # Create .env file in project root
   CONTACT_EMAIL_ENABLED=true
   CONTACT_EMAIL_TO=your-email@yourdomain.com
   CONTACT_EMAIL_FROM=Portfolio Contact <info@yourdomain.com>
   MAILGUN_API_KEY=your-mailgun-api-key
   MAILGUN_DOMAIN=mg.yourdomain.com
   ```

4. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

5. **Access the application**
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

### **Mailgun Setup (Recommended)**

1. **Create Mailgun Account**
   - Sign up at [mailgun.com](https://mailgun.com)
   - Choose EU or US region based on your location

2. **Domain Verification**
   - Add your domain (e.g., `mg.yourdomain.com`)
   - Add DNS records (MX, TXT, CNAME) as provided by Mailgun
   - Wait for verification (can take up to 48 hours)

3. **Configuration**
   ```bash
   MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxxxxxxxxx
   MAILGUN_DOMAIN=mg.yourdomain.com
   CONTACT_EMAIL_FROM=Portfolio <info@yourdomain.com>
   CONTACT_EMAIL_TO=your-email@yourdomain.com
   ```

### **Mailgun Regions**
- **EU Region**: Uses `https://api.eu.mailgun.net` (configured by default)
- **US Region**: Uses `https://api.mailgun.net` (update `MAILGUN_API_BASE` if needed)

### **Email Flow**
- **From**: Your professional email (info@yourdomain.com)
- **To**: Your personal email where you receive contact forms
- **Reply-To**: Automatically set to the contact form submitter's email

## 🛡️ Security Features

### **Anti-Spam Protection**
- **Rate Limiting** - 3 submissions per 15 minutes per IP
- **Honeypot Fields** - Hidden fields to catch bots
- **Content Analysis** - Spam keyword detection
- **Input Validation** - Server-side validation for all fields
- **Email Validation** - Proper email format validation with support for "Name <email>" format

### **Security Headers**
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Secure cookies in production

### **Email Security**
- **API Authentication** - Secure Mailgun API key authentication
- **Retry Logic** - Exponential backoff with 3 retry attempts
- **Error Handling** - Comprehensive error logging and user feedback
- **Email Masking** - Sensitive email addresses masked in logs

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

### **Email Monitoring**
- Contact form submissions are logged with correlation IDs
- Email sending attempts and failures are tracked
- Mailgun provides delivery analytics and logs

## 🌐 Deployment

### **Railway Deployment**
1. Connect GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on git push

### **Environment Variables for Production**
```bash
# Contact Form Configuration
CONTACT_EMAIL_ENABLED=true
CONTACT_EMAIL_TO=your-email@yourdomain.com
CONTACT_EMAIL_FROM=Portfolio Contact <info@yourdomain.com>

# Mailgun Configuration
MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxxxxxxxxx
MAILGUN_DOMAIN=mg.yourdomain.com

# Admin Configuration
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-secure-admin-password

# Railway Configuration
SPRING_PROFILES_ACTIVE=railway
```

## 📝 Project Structure

```
src/
├── main/
│   ├── java/work/azmarach/azmaweb/
│   │   ├── config/                  # Security, I18n configuration
│   │   ├── controller/              # Web and API controllers
│   │   ├── dto/                     # Data transfer objects
│   │   └── service/                 # Business logic services
│   │       ├── ContactService       # Email handling with Mailgun
│   │       ├── RateLimitService     # Rate limiting logic
│   │       └── SpamDetectionService # Anti-spam protection
│   ├── resources/
│   │   ├── static/                  # CSS, JavaScript, images
│   │   ├── templates/               # Thymeleaf templates
│   │   └── messages*.properties     # Internationalization
└── test/                            # Unit and integration tests
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

### **Email Templates**
Modify `ContactService.formatEmailBody()` method to customize email format

## 🔧 Development

### **Adding New Languages**
1. Create `messages_[lang].properties`
2. Add language to `I18nConfig.java`
3. Update language switcher in `layout.html`

### **Email Testing**
- Set `CONTACT_EMAIL_ENABLED=false` to disable email sending and log submissions instead
- Use Mailgun's sandbox domain for testing
- Check Mailgun logs for delivery status and issues

### **Adding New Pages**
1. Create Thymeleaf template in `templates/`
2. Add controller method in appropriate controller
3. Update navigation in `layout.html`

## 🔍 Troubleshooting

### **Email Not Sending**
1. **Check Configuration**: Verify all environment variables are set correctly
2. **Mailgun Domain**: Ensure domain is verified in Mailgun dashboard
3. **API Key**: Verify API key is correct and has sending permissions
4. **DNS Records**: Confirm all DNS records are properly configured
5. **Logs**: Check application logs for detailed error messages with correlation IDs

### **Common Issues**
- **"Domain not verified"**: Complete Mailgun domain verification process
- **"Invalid API key"**: Check API key in Mailgun dashboard
- **Rate limiting**: Wait for rate limit reset or adjust limits in `RateLimitService`

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Jan Charamza**
- Website: [azmarach.work](https://azmarach.work)
- GitHub: [@charamzic](https://github.com/charamzic)
- LinkedIn: [charamzic](https://linkedin.com/in/charamzic)
- Email: charamza@pm.me

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/charamzic/azmaweb/issues).

---

⭐ **Star this repository if you found it helpful!**