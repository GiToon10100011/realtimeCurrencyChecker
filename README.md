# Currency Dashboard

Real-time currency exchange rate dashboard with smart revalidation system.

## Features

- 📈 Real-time exchange rate monitoring (Hana Bank API)
- 🚀 Smart revalidation (only updates on 3+ KRW changes)
- 📊 Interactive charts with ApexCharts
- ⚙️ User-configurable change thresholds
- 🌍 Multi-currency support
- ⚡ Redis caching for performance
- 🔄 WebSocket real-time updates

## Architecture

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS + ShadCN UI
- **Backend**: NestJS + Redis + WebSocket
- **Charts**: ApexCharts
- **Architecture**: Clean Architecture with DDD

## Getting Started

1. Install dependencies:
```bash
npm run install:all
```

2. Start Redis server:
```bash
redis-server
```

3. Start development servers:
```bash
npm run dev
```

## Project Structure

```
currencyDashboard/
├── apps/
│   ├── frontend/          # Next.js app
│   └── backend/           # NestJS app
├── packages/
│   ├── shared/            # Shared types/interfaces
│   └── utils/             # Common utilities
└── tools/                 # Build tools and configs
```