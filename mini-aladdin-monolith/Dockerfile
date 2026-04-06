# ── Stage 1: Build with Maven ──
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app
COPY pom.xml .
# Download dependencies first (Docker layer cache)
RUN apk add --no-cache maven && mvn dependency:go-offline -B

COPY src ./src
RUN mvn package -DskipTests -B

# ── Stage 2: Runtime ──
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# Render sets PORT env var (default 10000 for Docker)
EXPOSE 10000

# Optimize for free-tier memory (512MB)
ENTRYPOINT ["java", \
  "-Xmx384m", \
  "-Xms256m", \
  "-XX:+UseSerialGC", \
  "-Dserver.address=0.0.0.0", \
  "-Dspring.profiles.active=prod", \
  "-jar", "app.jar"]
