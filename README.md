# GC Snail Race Backend

GC Snail Race 백엔드 레포지토리입니다. 인증을 담당하는 `auth-service`, 사용자/영상 분석 흐름을 담당하는 `user-service`, API 라우팅을 담당하는 `nginx`, 캐시/세션 처리를 위한 `redis`로 구성되어 있습니다.

## 기술 스택

- Java 17
- Spring Boot 3.3.6
- Spring Security
- Spring Data JPA
- MySQL
- Redis
- AWS S3
- Gradle
- Docker Compose
- Nginx

## 프로젝트 구조

```text
backendRepo/
├── auth-service/          # 회원가입, 로그인, JWT 발급
├── user-service/          # 사용자 조회, 영상 업로드, 분석 결과 조회
├── nginx/                 # API Gateway 역할의 Nginx 설정
├── docker-compose.yml     # 로컬 통합 실행 구성
└── README.md
```

## 서비스 구성

| 서비스 | 포트 | 설명 |
| --- | --- | --- |
| `nginx` | `80` | 외부 요청을 내부 서비스로 프록시 |
| `auth-service` | `8080` | 인증/회원 API |
| `user-service` | `8081` | 사용자/영상 API |
| `redis` | `6379` | Redis 서버 |

## 사전 준비

- Docker, Docker Compose
- Java 17
- MySQL 데이터베이스
- AWS S3 접근 권한이 설정된 실행 환경
- AI 분석 서버, 기본값: `http://ceprj.gachon.ac.kr:60006`

## 환경 변수

루트 경로에 `.env` 파일을 생성하고 아래 값을 설정합니다.

```env
DB_URL=jdbc:mysql://host.docker.internal:3306/snail_race?serverTimezone=Asia/Seoul&characterEncoding=UTF-8
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
JWT_SECRET=secret-key-at-least-32-characters-long-12345678901234567890
AI_SERVER_BASE_URL=http://host.docker.internal:60006
```

| 변수 | 설명 |
| --- | --- |
| `DB_URL` | MySQL JDBC URL |
| `DB_USERNAME` | MySQL 사용자명 |
| `DB_PASSWORD` | MySQL 비밀번호 |
| `JWT_SECRET` | JWT 서명 키 |
| `AI_SERVER_BASE_URL` | user-service가 호출할 AI 분석 서버 주소 |

## 실행 방법

### Docker Compose 실행

```bash
docker compose up --build
```

백그라운드로 실행하려면 다음 명령을 사용합니다.

```bash
docker compose up -d --build
```

서비스를 중지하려면 다음 명령을 사용합니다.

```bash
docker compose down
```

### 개별 서비스 로컬 실행

각 서비스 디렉터리에서 Gradle로 실행할 수 있습니다.

```bash
cd auth-service
./gradlew bootRun
```

```bash
cd user-service
./gradlew bootRun
```

Windows 환경에서는 `./gradlew` 대신 `gradlew.bat`을 사용할 수 있습니다.

## 헬스 체크

```bash
curl http://localhost/health
curl http://localhost/auth/health
curl http://localhost/user/health
```

## 주요 API

### Auth Service

| Method | Path | 설명 |
| --- | --- | --- |
| `GET` | `/auth/health` | auth-service 상태 확인 |
| `POST` | `/auth/login` | 로그인 및 JWT 발급 |
| `POST` | `/auth/signup` | 회원가입 |
| `POST` | `/auth/register` | 회원가입 |
| `POST` | `/auth/logout` | 로그아웃 응답 |

Nginx를 통해 `/api/auth/*` 경로로도 접근할 수 있습니다.

### User Service

| Method | Path | 설명 |
| --- | --- | --- |
| `GET` | `/user/health` | user-service 상태 확인 |
| `GET` | `/user/{id}` | 사용자 정보 조회 |
| `POST` | `/api/uploads/presigned-url` | S3 업로드용 Presigned URL 생성 |
| `POST` | `/api/videos/upload` | 영상 파일 업로드 |
| `POST` | `/api/videos/url` | 영상 URL 제출 |
| `GET` | `/api/videos/my` | 내 영상 분석 이력 조회 |
| `GET` | `/api/videos/{id}/status` | 영상 처리 상태 조회 |
| `GET` | `/api/videos/{id}/result` | 영상 분석 결과 조회 |

`/api/videos/*` API는 JWT 인증 정보의 `userId` claim을 사용합니다.

## 테스트

각 서비스 디렉터리에서 테스트를 실행합니다.

```bash
cd auth-service
./gradlew test
```

```bash
cd user-service
./gradlew test
```

Windows 환경에서는 다음처럼 실행할 수 있습니다.

```bash
gradlew.bat test
```

## Nginx 라우팅

| 외부 경로 | 내부 서비스 |
| --- | --- |
| `/health` | Nginx 자체 헬스 체크 |
| `/auth/*` | `auth-service:8080` |
| `/api/auth/*` | `auth-service:8080/auth/*` |
| `/user/*` | `user-service:8081` |
| `/api/videos/*` | `user-service:8081` |
| `/api/uploads/*` | `user-service:8081` |

## 참고 사항

- `auth-service`와 `user-service`는 모두 MySQL을 사용하며, JPA `ddl-auto`는 `update`로 설정되어 있습니다.
- `user-service`는 AWS S3 버킷 `gachon-18-s3`와 `ap-northeast-2` 리전을 사용합니다.
- Docker Compose 실행 시 `user-service`의 AI 서버 주소는 기본적으로 `http://host.docker.internal:60006`으로 전달됩니다.
