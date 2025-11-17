# 1단계: 실행용 JDK 이미지
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

# 로컬에서 빌드한 JAR 파일 COPY
COPY build/libs/javaproject05-0.0.1-SNAPSHOT.jar app.jar

# 환경 변수 설정 가능 (DB 연결 등)
ENV JAVA_OPTS=""

# 실행 명령
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
