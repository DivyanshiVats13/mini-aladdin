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

# Render uses PORT env var
ENV PORT=8080
EXPOSE ${PORT}

# Optimize for free-tier memory (512MB)
ENTRYPOINT ["java", \
  "-Xmx384m", \
  "-Xms256m", \
  "-XX:+UseSerialGC", \
  "-Dspring.profiles.active=prod", \
  "-jar", "app.jar"]
