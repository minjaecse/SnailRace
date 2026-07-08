# Solomon AI Frontend

AI 생성 영상과 딥페이크 여부를 분석하고, 판별 결과와 근거를 사용자에게 제공하는 Solomon AI 프론트엔드입니다. React 기반의 SPA로 제작되었으며 Vercel을 통해 배포했습니다.

> Vercel 배포 링크: `https://your-vercel-domain.vercel.app`

## 프로젝트 소개

Solomon AI는 사용자가 업로드한 영상 또는 영상 URL을 기반으로 AI 조작 가능성을 분석하는 서비스입니다. 단순 판별 결과뿐 아니라 의심 프레임, 점수, XAI 시각화 결과 등 판단 근거를 함께 제공하는 것을 목표로 합니다.

## 주요 기능

- 영상 파일 업로드 또는 URL 입력을 통한 분석 요청
- Deepfake / T2V 분석 타입 지원
- 분석 진행 상태 확인
- AI 생성 가능성 점수 및 최종 판정 결과 표시
- 의심 프레임, 히트맵, 설명 텍스트 등 XAI 기반 결과 표시
- 회원가입, 로그인, 로그아웃, 토큰 기반 인증
- 사용자별 분석 이력 조회
- 아이디 찾기, 비밀번호 찾기, 문의 화면 제공
- Vercel rewrite를 활용한 HTTPS 프론트엔드와 HTTP 백엔드 연동

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| Framework | React 19 |
| Language | TypeScript |
| Build Tool | Vite |
| Routing | React Router DOM |
| State Management | Zustand |
| 3D / Visual | Three.js |
| Styling | CSS Modules, CSS Variables |
| Deploy | Vercel |
| Code Quality | ESLint |

## 폴더 구조

```text
frontendRepo
├─ public
│  ├─ favicon.svg
│  └─ icons.svg
├─ src
│  ├─ assets
│  ├─ components
│  │  ├─ common
│  │  ├─ home
│  │  └─ scan
│  ├─ lib
│  │  └─ api.ts
│  ├─ pages
│  ├─ stores
│  ├─ styles
│  ├─ App.tsx
│  └─ main.tsx
├─ vercel.json
├─ vite.config.ts
└─ package.json
```

## 페이지 구성

| Route | 설명 |
| --- | --- |
| `/` | 영상 분석 입력 페이지 |
| `/scan/analysis` | Deepfake 분석 결과 페이지 |
| `/scan/analysis/t2v` | T2V 분석 결과 페이지 |
| `/home` | 서비스 소개 페이지 |
| `/history` | 사용자 분석 이력 페이지 |
| `/contact` | 문의 페이지 |
| `/login` | 로그인 페이지 |
| `/register` | 회원가입 페이지 |
| `/waitlist` | 대기자 등록 페이지 |
| `/find-id` | 아이디 찾기 페이지 |
| `/find-password` | 비밀번호 찾기 페이지 |

## 실행 방법

### 1. 저장소 클론

```bash
git clone <repository-url>
cd frontendRepo
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다.

### 4. 프로덕션 빌드

```bash
npm run build
```

### 5. 빌드 결과 미리보기

```bash
npm run preview
```

## 환경 변수

백엔드 API 주소는 `src/lib/api.ts`에서 관리합니다. 로컬 또는 배포 환경에서 별도 API 주소를 사용하려면 아래 환경 변수를 설정할 수 있습니다.

```env
VITE_AUTH_API_BASE_URL=http://your-auth-api
VITE_USER_API_BASE_URL=http://your-user-api
VITE_VIDEO_API_BASE_URL=http://your-video-api
```

현재 기본 백엔드 주소는 `http://43.200.145.225`입니다.

## Vercel 배포 설정

Vercel 배포 환경에서는 브라우저의 mixed content 문제를 피하기 위해 `/api/backend` 프록시 경로를 사용합니다.

```json
{
  "rewrites": [
    {
      "source": "/api/backend/:path*",
      "destination": "http://43.200.145.225/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

첫 번째 rewrite는 Vercel HTTPS 도메인에서 HTTP 백엔드로 요청을 전달합니다. 두 번째 rewrite는 React Router 기반 SPA 라우팅을 위해 모든 경로를 `index.html`로 연결합니다.

## API 연동 요약

- 인증: 회원가입, 로그인, 로그아웃, 토큰 재발급
- 사용자: 사용자 정보 조회
- 영상 분석: 파일 업로드, URL 분석 요청, 상태 조회, 결과 조회
- 이력: 사용자별 분석 기록 조회 및 상세 조회

API 응답은 `src/lib/api.ts`에서 프론트엔드 화면에 맞는 형태로 정규화합니다.

## 배포

이 프로젝트는 Vercel에 배포했습니다.

```bash
npm run build
```

Vercel의 기본 빌드 설정은 다음과 같이 사용할 수 있습니다.

| 항목 | 값 |
| --- | --- |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

## 팀

- Team: RunningSnail
- Product: Solomon AI
