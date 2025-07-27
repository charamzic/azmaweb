# Multi-stage build for optimal image size
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Set working directory
WORKDIR /app

# Copy pom.xml first for better layer caching
COPY pom.xml .

# Download dependencies with timeout and retry settings
RUN mvn dependency:go-offline -B \
    -Dmaven.wagon.http.connectionTimeout=30000 \
    -Dmaven.wagon.http.readTimeout=30000 \
    -Dmaven.wagon.rto=10000 \
    -Dmaven.wagon.httpconnectionManager.ttlSeconds=120 \
    -Dhttp.keepAlive=false \
    -Dmaven.wagon.http.pool=false

# Copy source code
COPY src ./src

# Build the application with optimized settings
RUN mvn clean package -DskipTests -B \
    -Dmaven.wagon.http.connectionTimeout=30000 \
    -Dmaven.wagon.http.readTimeout=30000 \
    -Dhttp.keepAlive=false

# Production stage
FROM eclipse-temurin:17-jre-jammy

# Create non-root user for security
RUN groupadd -r azmarach && useradd -r -g azmarach azmarach

# Set working directory
WORKDIR /app

# Copy the JAR file from build stage
COPY --from=build /app/target/*.jar app.jar

# Change ownership to non-root user
RUN chown azmarach:azmarach app.jar

# Switch to non-root user
USER azmarach

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# JVM optimization for containerized environments
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseG1GC -XX:+UseStringDeduplication"

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]