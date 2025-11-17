# 1단계: Gradle 빌드
FROM gradle:jdk17-jammy AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle build --no-daemon --stacktrace --info

# 2단계: 실행용 JDK 이미지
FROM eclipse-temurin:17-jdk-jammy
COPY --from=build /home/gradle/src/build/libs/javaproject05-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java", "-jar", "/app.jar"]
