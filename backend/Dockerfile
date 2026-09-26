FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY . .
ENV BUILD_VERSION=4.0.0
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/campusconnect-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
