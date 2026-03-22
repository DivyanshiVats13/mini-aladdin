-- ============================================================
-- Mini Aladdin — Seed Data (H2-compatible)
-- ============================================================

MERGE INTO assets (id, ticker, name, asset_type, exchange, sector, currency)
KEY (ticker, exchange)
VALUES
    (RANDOM_UUID(), 'AAPL',  'Apple Inc.',                'EQUITY', 'NASDAQ', 'Technology',         'USD'),
    (RANDOM_UUID(), 'MSFT',  'Microsoft Corporation',     'EQUITY', 'NASDAQ', 'Technology',         'USD'),
    (RANDOM_UUID(), 'GOOGL', 'Alphabet Inc.',             'EQUITY', 'NASDAQ', 'Technology',         'USD'),
    (RANDOM_UUID(), 'AMZN',  'Amazon.com Inc.',           'EQUITY', 'NASDAQ', 'Consumer Cyclical',  'USD'),
    (RANDOM_UUID(), 'JPM',   'JPMorgan Chase & Co.',      'EQUITY', 'NYSE',   'Financial Services', 'USD'),
    (RANDOM_UUID(), 'JNJ',   'Johnson & Johnson',         'EQUITY', 'NYSE',   'Healthcare',         'USD'),
    (RANDOM_UUID(), 'SPY',   'SPDR S&P 500 ETF Trust',   'ETF',    'NYSE',   'Broad Market',       'USD'),
    (RANDOM_UUID(), 'GLD',   'SPDR Gold Shares',          'ETF',    'NYSE',   'Commodities',        'USD');

MERGE INTO assets (id, ticker, name, isin, asset_type, exchange, sector, currency)
KEY (ticker, exchange)
VALUES
    (RANDOM_UUID(), 'RELIANCE',  'Reliance Industries Ltd.',    'INE002A01018', 'EQUITY', 'NSE', 'Energy',             'INR'),
    (RANDOM_UUID(), 'TCS',       'Tata Consultancy Services',   'INE467B01029', 'EQUITY', 'NSE', 'Technology',         'INR'),
    (RANDOM_UUID(), 'INFY',      'Infosys Ltd.',                'INE009A01021', 'EQUITY', 'NSE', 'Technology',         'INR'),
    (RANDOM_UUID(), 'HDFCBANK',  'HDFC Bank Ltd.',              'INE040A01034', 'EQUITY', 'NSE', 'Financial Services', 'INR'),
    (RANDOM_UUID(), 'ICICIBANK', 'ICICI Bank Ltd.',             'INE090A01021', 'EQUITY', 'NSE', 'Financial Services', 'INR'),
    (RANDOM_UUID(), 'HINDUNILVR','Hindustan Unilever Ltd.',     'INE030A01027', 'EQUITY', 'NSE', 'Consumer Defensive', 'INR'),
    (RANDOM_UUID(), 'NIFTYBEES', 'Nippon India ETF Nifty BeES', 'INF204KB14I2', 'ETF',    'NSE', 'Broad Market',       'INR'),
    (RANDOM_UUID(), 'GOLDBEES',  'Nippon India ETF Gold BeES',  'INF204KA1B64', 'ETF',    'NSE', 'Commodities',        'INR');
