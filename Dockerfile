FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .

RUN mvn dependency:go-offline -B \
    -Dmaven.wagon.http.connectionTimeout=30000 \
    -Dmaven.wagon.http.readTimeout=30000 \
    -Dmaven.wagon.rto=10000 \
    -Dmaven.wagon.httpconnectionManager.ttlSeconds=120 \
    -Dhttp.keepAlive=false \
    -Dmaven.wagon.http.pool=false

COPY src ./src

RUN mvn clean package -DskipTests -B \
    -Dmaven.wagon.http.connectionTimeout=30000 \
    -Dmaven.wagon.http.readTimeout=30000 \
    -Dhttp.keepAlive=false

# Production stage
FROM eclipse-temurin:21-jre-jammy

# Create non-root user for security
RUN groupadd -r azmarach && useradd -r -g azmarach azmarach

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

RUN chown azmarach:azmarach app.jar

USER azmarach

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# JVM optimization for containerized environments
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseG1GC -XX:+UseStringDeduplication"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]