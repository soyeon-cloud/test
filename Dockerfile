# 1단계: Gradle 빌드
FROM gradle:jdk21-jammy AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src

# gradlew 실행 권한 추가
RUN chmod +x gradlew

# 빌드 실행
RUN ./gradlew clean bootJar

# 2단계: 실행용 JDK 이미지
FROM eclipse-temurin:21-jdk-jammy

# 환경 변수 설정 (DB 연결 정보)
ENV DB_URL=jdbc:mysql://your-db-host:3306/study_assistant_clean?serverTimezone=Asia/Seoul&characterEncoding=UTF-8
ENV DB_USER=root
ENV DB_PASS=1234

# 빌드된 JAR 복사
COPY --from=build /home/gradle/src/build/libs/javaproject05-0.0.1-SNAPSHOT.jar app.jar

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "/app.jar"]


