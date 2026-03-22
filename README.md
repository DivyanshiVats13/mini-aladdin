# ✦ Mini Aladdin

**Portfolio Risk & Rebalancing Engine** — A full-stack SaaS platform inspired by BlackRock's Aladdin system. Built with Spring Boot microservices, React, Redis, Kafka, and PostgreSQL.

---

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────────────────────────────────┐
│  React App  │────▶│          API Gateway (:8080)              │
│   (:5173)   │     │   Spring Cloud Gateway — routes /api/*   │
└─────────────┘     └──────────┬───────────────────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          ▼                    ▼                    ▼
   Auth Service          Portfolio Service    Market Data Service
     (:8081)                (:8082)               (:8086)
   JWT + BCrypt         Holdings + P&L       Alpha Vantage + Redis
          │                    │                    │
          ▼                    ▼                    ▼
   Risk Engine          Rebalance Engine    Stress Test Service
     (:8083)                (:8084)               (:8085)
   Beta, VaR, Sharpe    Drift Detection      Historical Crashes
```

## 🛠️ Tech Stack

| Layer      | Technology                                      |
|------------|--------------------------------------------------|
| Backend    | Java 21, Spring Boot 3.4, Spring Cloud Gateway   |
| Frontend   | React 19, Vite 7, Tailwind CSS 4                 |
| Database   | PostgreSQL 16                                    |
| Cache      | Redis 7                                          |
| Messaging  | Apache Kafka                                     |
| Auth       | JWT (JJWT 0.12.6) + BCrypt                      |
| API Docs   | Springdoc OpenAPI (Swagger UI)                   |

## 📦 Project Structure

```
mini-aladdin/
├── mini-aladdin-backend/          # Maven multi-module project
│   ├── common/                    # Shared DTOs, utilities
│   ├── auth-service/              # JWT authentication (port 8081)
│   ├── portfolio-service/         # Portfolio CRUD + P&L (port 8082)
│   ├── risk-engine/               # Beta, VaR, Sharpe, sector analysis (port 8083)
│   ├── rebalance-engine/          # Drift detection + recommendations (port 8084)
│   ├── stress-test-service/       # Historical crash simulations (port 8085)
│   ├── market-data-service/       # Price fetching + Redis cache (port 8086)
│   └── gateway/                   # API Gateway + CORS (port 8080)
├── mini-aladdin-frontend/         # React + Vite + Tailwind
│   └── src/
│       ├── pages/                 # Dashboard, Portfolios, Risk, Rebalance, Stress Test
│       ├── components/            # Sidebar, AddHoldingModal
│       ├── context/               # AuthContext (JWT management)
│       ├── layouts/               # AppLayout (protected routes)
│       └── api/                   # Axios client with JWT interceptor
└── docker-compose.yml             # PostgreSQL + Redis + Kafka
```

## 🚀 Getting Started

### Prerequisites
- Java 21+
- Node.js 18+
- Docker & Docker Compose

### 1. Start Infrastructure
```bash
docker-compose up -d
```
This starts PostgreSQL (port 5432), Redis (port 6379), and Kafka (port 9092).

### 2. Run Backend Services
```bash
cd mini-aladdin-backend

# Run each service in a separate terminal:
./mvnw spring-boot:run -pl auth-service
./mvnw spring-boot:run -pl portfolio-service
./mvnw spring-boot:run -pl risk-engine
./mvnw spring-boot:run -pl rebalance-engine
./mvnw spring-boot:run -pl stress-test-service
./mvnw spring-boot:run -pl market-data-service
./mvnw spring-boot:run -pl gateway
```

### 3. Run Frontend
```bash
cd mini-aladdin-frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

## 📡 API Endpoints

All endpoints are accessible through the gateway at `http://localhost:8080/api/`.

| Method | Endpoint                        | Service            | Description                     |
|--------|----------------------------------|--------------------|---------------------------------|
| POST   | `/api/auth/register`            | Auth               | Register new user               |
| POST   | `/api/auth/login`               | Auth               | Login, returns JWT              |
| GET    | `/api/auth/me`                  | Auth               | Get current user profile        |
| GET    | `/api/portfolios`               | Portfolio           | List user's portfolios          |
| POST   | `/api/portfolios`               | Portfolio           | Create portfolio                |
| GET    | `/api/portfolios/{id}`          | Portfolio           | Get portfolio with holdings     |
| POST   | `/api/portfolios/{id}/holdings` | Portfolio           | Add holding                     |
| GET    | `/api/assets/search?q=`         | Portfolio           | Search assets                   |
| GET    | `/api/prices/{ticker}`          | Market Data         | Get price for ticker            |
| POST   | `/api/prices/batch`             | Market Data         | Get prices for multiple tickers |
| GET    | `/api/risk/portfolio/{id}`      | Risk Engine         | Full risk report                |
| GET    | `/api/risk/sector/{id}`         | Risk Engine         | Sector concentration            |
| GET    | `/api/rebalance/portfolio/{id}` | Rebalance Engine    | Drift analysis + recommendations|
| GET    | `/api/stress-test/scenarios`    | Stress Test         | List available scenarios        |
| POST   | `/api/stress-test/run/{id}`     | Stress Test         | Run all scenarios on portfolio  |

## ⚙️ Environment Variables

| Variable               | Default            | Description                    |
|------------------------|--------------------|---------------------------------|
| `JWT_SECRET`           | (random)           | JWT signing key                 |
| `JWT_EXPIRATION_MS`    | `86400000`         | Token expiry (24h)              |
| `ALPHA_VANTAGE_API_KEY`| `demo`             | Market data API key             |
| `PORTFOLIO_SERVICE_URL`| `localhost:8082`   | Inter-service URL               |

## 📄 License

MIT
