-- ═══════════════════════════════════════════════
-- Mini Aladdin — Database Schema (PostgreSQL)
-- Safe to run multiple times (IF NOT EXISTS)
-- ═══════════════════════════════════════════════

-- ── Auth tables ──

CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name   VARCHAR(128),
    avatar_url  TEXT,
    tier        VARCHAR(16) NOT NULL DEFAULT 'FREE',
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL UNIQUE REFERENCES users(id),
    plan          VARCHAR(16) NOT NULL DEFAULT 'FREE',
    status        VARCHAR(16) NOT NULL DEFAULT 'ACTIVE',
    started_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expires_at    TIMESTAMP WITH TIME ZONE,
    stripe_sub_id VARCHAR(128),
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ── Portfolio tables ──

CREATE TABLE IF NOT EXISTS assets (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker     VARCHAR(20) NOT NULL,
    name       VARCHAR(255) NOT NULL,
    isin       VARCHAR(12) UNIQUE,
    asset_type VARCHAR(24) NOT NULL,
    exchange   VARCHAR(16) NOT NULL,
    sector     VARCHAR(64),
    currency   VARCHAR(4) NOT NULL DEFAULT 'USD',
    CONSTRAINT uq_assets_ticker_exchange UNIQUE (ticker, exchange)
);

CREATE TABLE IF NOT EXISTS portfolios (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL,
    name       VARCHAR(128) NOT NULL DEFAULT 'My Portfolio',
    currency   VARCHAR(4) NOT NULL DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolios_user ON portfolios(user_id);

CREATE TABLE IF NOT EXISTS holdings (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id  UUID NOT NULL REFERENCES portfolios(id),
    asset_id      UUID NOT NULL REFERENCES assets(id),
    quantity      NUMERIC(18,6) NOT NULL,
    avg_buy_price NUMERIC(18,4) NOT NULL,
    added_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_holdings_portfolio_asset UNIQUE (portfolio_id, asset_id)
);

CREATE INDEX IF NOT EXISTS idx_holdings_portfolio ON holdings(portfolio_id);

CREATE TABLE IF NOT EXISTS target_allocations (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id),
    asset_type   VARCHAR(24) NOT NULL,
    target_pct   NUMERIC(5,2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_target_alloc_portfolio ON target_allocations(portfolio_id);
