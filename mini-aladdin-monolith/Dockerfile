# ── Stage 1: Build with Maven ──
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw.cmd .

# Download dependencies first (Docker layer cache)
RUN apt-get update && apt-get install -y maven && mvn dependency:go-offline -B

COPY src ./src
RUN mvn package -DskipTests -B

# ── Stage 2: Runtime (Debian-based for proper SSL/DNS) ──
FROM eclipse-temurin:21-jre

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
