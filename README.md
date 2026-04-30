# ✦ Mini Aladdin — Portfolio Risk & Rebalancing Engine

A full-stack **SaaS platform** for portfolio management, real-time risk analytics, allocation rebalancing, and historical crash stress testing. Built with **Spring Boot 3.4** (monolith) and **React 19 + Vite**.

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     React SPA (Vite)                     │
│        Port 5173  — Tailwind CSS 4 + glassmorphism       │
│   Dashboard │ Portfolios │ Risk │ Rebalance │ Stress     │
└──────────────────┬───────────────────────────────────────┘
                   │  Axios → /api/* (proxied)
                   ▼
┌──────────────────────────────────────────────────────────┐
│              Spring Boot 3.4 Monolith                    │
│                     Port 8080                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Auth Service     │ JWT stateless authentication   │  │
│  │  Portfolio Service│ CRUD + P&L + live pricing      │  │
│  │  Market Data      │ Yahoo Finance (cached 5min)    │  │
│  │  Risk Engine      │ Beta, Vol, Sharpe, VaR         │  │
│  │  Rebalance Engine │ Drift detection & BUY/SELL     │  │
│  │  Stress Test      │ Historical crash simulations   │  │
│  └────────────────────────────────────────────────────┘  │
│               Database: H2 (dev) / PostgreSQL (prod)     │
└──────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### 🔐 Authentication
- JWT-based stateless auth (JJWT 0.12.6)
- Register/Login with automatic token management
- Protected routes with redirect to login
- User tier system (FREE/PRO)

### 💼 Portfolio Management
- Create, view, and delete portfolios (USD/INR)
- Add/remove holdings with asset search (seeded catalogue)
- **Live P&L** calculated with real-time Yahoo Finance prices
- Per-holding metrics: market value, cost basis, P&L, weight %

### ⚡ Risk Analytics
- **Portfolio Beta** — sensitivity vs S&P 500
- **Annualized Volatility** — standard deviation of returns
- **Sharpe Ratio** — risk-adjusted performance
- **Value at Risk (VaR)** — 95% confidence daily loss estimate
- **Sector Concentration** — visual breakdown with warnings

### ⚖️ Rebalance Engine
- Compare current allocation vs target allocation
- ±2% drift threshold detection
- **BUY/SELL recommendations** with estimated trade values
- Auto-generates equal-weight targets if none set

### 🔥 Stress Testing
- **5 pre-built scenarios**: 2008 Crisis, COVID, Dot-com, Rate Hike, Stagflation
- Per-asset-type shock modeling (equity vs bond vs commodity)
- Visual impact bars with worst/best case summary
- Dollar-value impact calculations

### 📊 Dashboard
- Aggregated portfolio value, P&L, beta, and Sharpe ratio
- Top 5 holdings with weight percentage
- Quick stats and navigation links

---

## 🚀 Getting Started

### Prerequisites
- **Java 21** (JDK)
- **Node.js 18+** with npm
- **Maven** (or use the included `mvnw` wrapper)

### 1. Backend (Spring Boot)

```bash
cd mini-aladdin-monolith

# Set JWT secret (min 256-bit key for HS256)
# On Windows PowerShell:
$env:JWT_SECRET="your-very-long-secret-key-at-least-32-characters-long"

# Build and run
./mvnw spring-boot:run
```

The backend starts on **http://localhost:8080** with H2 in-memory database.

> **Note**: On first startup, the asset catalogue is seeded automatically with 20 US & Indian stocks.

### 2. Frontend (React + Vite)

```bash
cd mini-aladdin-frontend

npm install
npm run dev
```

The frontend starts on **http://localhost:5173** and proxies API calls to the backend.

### 3. Open the App

Navigate to **http://localhost:5173** → Register → Create portfolios → Explore!

---

## 📡 API Reference

All endpoints are behind JWT authentication (except auth endpoints).

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login and receive JWT |
| GET | `/auth/me` | Get current user profile |

### Portfolios
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/portfolios` | List all portfolios (summary) |
| POST | `/portfolios` | Create new portfolio |
| GET | `/portfolios/{id}` | Get portfolio detail with holdings |
| DELETE | `/portfolios/{id}` | Delete portfolio |
| POST | `/portfolios/{id}/holdings` | Add holding to portfolio |
| DELETE | `/portfolios/{id}/holdings/{hid}` | Remove holding |

### Assets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/assets?search=AAPL` | Search asset catalogue |

### Market Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/market/quote/{ticker}` | Get real-time price quote |
| GET | `/market/batch?tickers=AAPL,MSFT` | Batch price quotes |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/summary` | Aggregated portfolio overview |

### Risk Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/risk/portfolio/{id}` | Full risk report (beta, vol, Sharpe, VaR) |
| GET | `/risk/sector/{id}` | Sector concentration breakdown |

### Rebalance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/rebalance/portfolio/{id}` | Drift analysis & recommendations |

### Stress Test
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stress-test/scenarios` | List available scenarios |
| POST | `/stress-test/run/{portfolioId}` | Run all scenarios on portfolio |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Java 21, Spring Boot 3.4, Spring Security, Spring Data JPA |
| **Auth** | JJWT 0.12.6 (HS256 JWT) |
| **Database** | H2 (dev), PostgreSQL (prod) |
| **Market Data** | Yahoo Finance (free, no API key needed) |
| **Frontend** | React 19, Vite 7, Tailwind CSS 4 |
| **HTTP Client** | Axios with JWT interceptor |
| **Design** | Glassmorphism, dark navy palette, Inter font |

---

## 📁 Project Structure

```
mini-aladdin/
├── mini-aladdin-monolith/          # Spring Boot backend
│   └── src/main/java/com/minialaddin/
│       ├── auth/                   # JWT auth (controller, service, model)
│       ├── portfolio/              # Portfolio CRUD + P&L
│       ├── market/                 # Market data + dashboard
│       ├── risk/                   # Risk engine (beta, vol, Sharpe, VaR)
│       ├── rebalance/              # Rebalance engine (drift, recommendations)
│       ├── stresstest/             # Stress test (historical crash sims)
│       ├── common/                 # Shared DTOs, utils, exceptions
│       └── config/                 # Security, CORS configuration
│
└── mini-aladdin-frontend/          # React SPA
    └── src/
        ├── api/                    # Axios client with JWT interceptor
        ├── context/                # Auth context (login/register/logout)
        ├── layouts/                # AppLayout (sidebar + outlet)
        ├── components/             # Sidebar, AddHoldingModal
        └── pages/                  # All 8 pages (Login, Register, Dashboard, etc.)
```

---

## 🔑 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `JWT_SECRET` | Yes | (none) | HS256 signing key (min 32 chars) |
| `SPRING_PROFILES_ACTIVE` | No | `default` (H2) | Set to `prod` for PostgreSQL |
| `DB_URL` | Prod only | — | PostgreSQL connection URL |
| `DB_USERNAME` | Prod only | — | Database username |
| `DB_PASSWORD` | Prod only | — | Database password |
| `VITE_API_URL` | Prod only | `/api` | Backend URL for production frontend |

---

## 📄 License

MIT — Built for educational and portfolio demonstration purposes.
