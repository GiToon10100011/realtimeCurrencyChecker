# Currency Dashboard

실시간 환율 모니터링 대시보드 with 스마트 재검증 시스템

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

</div>

## ✨ 주요 기능

### 📊 실시간 환율 모니터링
- **실시간 데이터**: Hana Bank API를 통한 8개 주요 통화 환율 실시간 업데이트
- **WebSocket 연결**: 서버-클라이언트 간 실시간 양방향 통신
- **스마트 재검증**: 3+ KRW 변동 시에만 업데이트로 성능 최적화

### 🎛️ 개별 통화 설정 시스템
- **맞춤형 표시**: 각 통화별로 원화 기준 금액 개별 설정 가능
- **직관적 UI**: `₩1,000 = $0.75` 형태로 설정한 금액 기준 외화 표시
- **실시간 반영**: 설정 변경 시 카드와 차트에 즉시 반영

### 📈 인터랙티브 차트
- **ApexCharts**: 반응형 실시간 차트로 환율 변동 추이 시각화
- **사용자 선택**: 모니터링 중인 통화 중 차트 표시 통화 선택 가능
- **라이브 업데이트**: 실시간 데이터 스트리밍으로 차트 자동 업데이트

### 💱 환율 계산기
- **양방향 변환**: 원화 ↔ 모든 지원 통화 간 실시간 변환
- **정확한 계산**: 현재 환율 기반 정밀 계산 (소수점 2자리)
- **직관적 UI**: 드롭다운 선택과 스왑 버튼으로 쉬운 조작

### ⚙️ 고급 설정 기능
- **변동 임계값**: 환율 변동 알림 기준 설정 (3-100 KRW)
- **통화 선택**: 모니터링할 통화 개별 선택/해제
- **차트 통화**: 차트에 표시할 통화 선택
- **로컬 저장**: 사용자 설정 브라우저 로컬 저장소 저장

### 🚀 성능 최적화
- **Redis 캐싱**: 환율 데이터 고성능 캐싱으로 빠른 응답
- **스마트 폴링**: 불필요한 API 호출 최소화
- **반응형 디자인**: 모바일/태블릿/데스크톱 완벽 지원

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 15.4.5 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS v4 + PostCSS
- **UI Components**: Custom components with ShadCN UI patterns
- **Charts**: ApexCharts 4.0.0 + React ApexCharts 1.7.0
- **State Management**: TanStack React Query 5.17.0
- **Real-time**: Socket.IO Client 4.7.4
- **Icons**: Lucide React 0.300.0
- **Build Tool**: Turbopack (Next.js)

### Backend
- **Framework**: NestJS 11.0.1
- **Language**: TypeScript 5.7.3
- **Cache**: Redis 4.6.11 + cache-manager 5.3.1
- **Real-time**: Socket.IO 4.7.4 + WebSocket Gateway
- **HTTP Client**: Axios (NestJS Axios 3.1.3)
- **Scheduling**: NestJS Schedule 4.0.0
- **Validation**: class-validator 0.14.0 + class-transformer 0.5.1
- **Configuration**: NestJS Config 3.1.1

### DevOps & Tools
- **Containerization**: Docker + Docker Compose
- **Database**: Redis 7 (Alpine)
- **Development**: Concurrently 8.2.2
- **Testing**: Jest 30.0.0 + Supertest 7.0.0
- **Linting**: ESLint 9.18.0 + Prettier 3.4.2
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (Frontend) + Railway (Backend)

### Architecture Patterns
- **Backend**: Clean Architecture + Domain-Driven Design (DDD)
- **Frontend**: Component-based Architecture
- **Data Flow**: WebSocket + REST API Hybrid
- **Caching Strategy**: Redis with TTL-based invalidation

## 🎯 지원 통화

| 통화 | 코드 | 심볼 | 기본 설정 |
|------|------|------|-----------|
| 미국 달러 | USD | $ | ₩1 |
| 유로 | EUR | € | ₩1 |
| 일본 엔 | JPY | ¥ | ₩1 |
| 중국 위안 | CNY | ¥ | ₩1 |
| 영국 파운드 | GBP | £ | ₩1 |
| 호주 달러 | AUD | A$ | ₩1 |
| 캐나다 달러 | CAD | C$ | ₩1 |
| 스위스 프랑 | CHF | Fr | ₩1 |

## 🚀 빠른 시작

### 전제 조건
- Node.js >= 18.0.0
- npm >= 9.0.0
- Redis Server

### 1. 저장소 클론
```bash
git clone https://github.com/your-username/currencyDashboard.git
cd currencyDashboard
```

### 2. 의존성 설치
```bash
npm run install:all
```

### 3. 환경 변수 설정
```bash
# Backend 환경 변수
cp apps/backend/.env.example apps/backend/.env

# Frontend 환경 변수
cp apps/frontend/.env.local.example apps/frontend/.env.local
```

### 4. Redis 서버 시작
```bash
# Docker 사용 (권장)
docker run -d -p 6379:6379 --name redis redis:7-alpine

# 또는 로컬 Redis
redis-server
```

### 5. 개발 서버 시작
```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 📁 프로젝트 구조

```
currencyDashboard/
├── apps/
│   ├── frontend/                   # Next.js = 애플리케이션
│   │   ├── src/
│   │   │   ├── app/               # App Router (Next.js 15)
│   │   │   ├── components/        # React 컴포넌트
│   │   │   │   ├── dashboard/     # 대시보드 관련 컴포넌트
│   │   │   │   └── ui/           # 재사용 가능한 UI 컴포넌트
│   │   │   ├── hooks/            # 커스텀 React 훅
│   │   │   ├── lib/              # 유틸리티 함수
│   │   │   └── types/            # TypeScript 타입 정의
│   │   └── public/               # 정적 자산
│   └── backend/                   # NestJS API 서버
│       ├── src/
│       │   ├── domain/           # 도메인 엔티티 및 인터페이스
│       │   ├── application/      # 유스케이스 및 애플리케이션 서비스
│       │   ├── infrastructure/   # 외부 통합 (API, Redis)
│       │   ├── presentation/     # 컨트롤러 및 WebSocket 게이트웨이
│       │   └── shared/           # 공유 설정
│       └── test/                 # E2E 테스트
├── packages/
│   ├── shared/                   # 공유 타입 및 인터페이스
│   └── utils/                    # 공통 유틸리티
├── .github/workflows/            # CI/CD 파이프라인
├── docker-compose.yml            # 컨테이너 오케스트레이션
├── DEPLOYMENT.md                 # 배포 가이드
├── SECRETS.md                    # GitHub Secrets 설정 가이드
└── CLAUDE.md                     # AI 개발 도우미 설정
```

## 🔧 사용 가능한 스크립트

### 루트 레벨
```bash
npm run dev              # 프론트엔드 + 백엔드 동시 개발 서버 시작
npm run build            # 전체 프로젝트 빌드
npm run install:all      # 모든 패키지 의존성 설치
npm run clean            # node_modules 및 빌드 파일 정리
npm test                 # 백엔드 테스트 실행
npm run lint             # 백엔드 린팅 실행
```

### Frontend (apps/frontend)
```bash
npm run dev              # 개발 서버 (Turbopack)
npm run build            # 프로덕션 빌드
npm run start            # 프로덕션 서버 시작
npm run lint             # Next.js 린팅
```

### Backend (apps/backend)
```bash
npm run start:dev        # 개발 서버 (watch mode)
npm run build            # TypeScript 빌드
npm run start:prod       # 프로덕션 서버
npm test                 # Jest 테스트
npm run test:e2e         # E2E 테스트
npm run lint             # ESLint + Prettier
```

## 🚀 배포

자세한 배포 가이드는 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참조하세요.

### 권장 배포 스택
- **Frontend**: Vercel (자동 배포 + CDN)
- **Backend**: Railway (Redis 포함)
- **Monitoring**: 내장 헬스체크 엔드포인트

### Docker 배포
```bash
docker-compose up -d
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 🙋‍♂️ 지원

문제가 있거나 질문이 있으시면 [Issues](https://github.com/your-username/currencyDashboard/issues)를 통해 문의해 주세요.

---

<div align="center">
Made with ❤️ using Next.js, NestJS, and Redis
</div>