FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY build/libs/javaproject05-0.0.1-SNAPSHOT.jar app.jar
ENV JAVA_OPTS=""
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]