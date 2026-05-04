import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
    const { user } = useAuth();
    if (user) return <Navigate to="/dashboard" replace />;

    const features = [
        { icon: '💼', title: 'Portfolio Management', desc: 'Create portfolios, add holdings, track P&L with live market prices from Yahoo Finance.' },
        { icon: '📊', title: 'Risk Analytics', desc: 'Portfolio Beta, Volatility, Sharpe Ratio, and 95% Value at Risk — calculated in real time.' },
        { icon: '⚖️', title: 'Auto Rebalance', desc: 'Detect allocation drift and get BUY/SELL recommendations to match your target weights.' },
        { icon: '🔥', title: 'Stress Testing', desc: 'Simulate 2008 Crisis, COVID crash, Dot-com burst, and more against your portfolio.' },
        { icon: '📈', title: 'Live Market Data', desc: 'Real-time stock prices with 5-minute caching. No API keys needed.' },
        { icon: '🔐', title: 'Secure by Default', desc: 'JWT authentication, encrypted passwords, and stateless session management.' },
    ];

    const techs = ['Spring Boot 3.4', 'React 19', 'PostgreSQL', 'Tailwind CSS 4', 'JWT Auth', 'Yahoo Finance API', 'Vite', 'Docker'];

    return (
        <div style={{ minHeight: '100vh', background: '#fff', color: '#111827', fontFamily: "'Inter', system-ui, sans-serif" }}>

            {/* Nav */}
            <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 3rem', borderBottom: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#059669', color: '#fff', fontWeight: 700, fontSize: '0.875rem' }}>MA</div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>Mini Aladdin</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/login" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, color: '#4B5563', textDecoration: 'none' }}>Sign In</Link>
                    <Link to="/register" style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem', fontWeight: 500, borderRadius: '0.5rem', color: '#fff', background: '#059669', textDecoration: 'none' }}>Get Started Free</Link>
                </div>
            </nav>

            {/* Hero */}
            <section style={{ maxWidth: '900px', margin: '0 auto', padding: '5rem 1.5rem 4rem', textAlign: 'center' }}>
                <div style={{ display: 'inline-block', padding: '0.375rem 1rem', marginBottom: '1.5rem', fontSize: '0.75rem', fontWeight: 500, borderRadius: '9999px', color: '#047857', background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
                    ✦ Portfolio Risk & Rebalancing Engine
                </div>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.5rem' }}>
                    Smarter Portfolio <span style={{ color: '#059669' }}>Risk Analytics</span>
                </h1>
                <p style={{ fontSize: '1.125rem', maxWidth: '640px', margin: '0 auto 2.5rem', lineHeight: 1.7, color: '#4B5563' }}>
                    Real-time risk metrics, automated rebalancing, and historical stress testing — all in one platform. Built for investors who want data-driven decisions.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <Link to="/register" style={{ padding: '0.875rem 2rem', fontSize: '1rem', fontWeight: 600, color: '#fff', background: '#059669', borderRadius: '0.75rem', textDecoration: 'none', transition: 'all 0.2s' }}>
                        Start Free — No Credit Card
                    </Link>
                    <a href="#features" style={{ padding: '0.875rem 2rem', fontSize: '1rem', fontWeight: 500, borderRadius: '0.75rem', color: '#4B5563', border: '1px solid #D1D5DB', textDecoration: 'none' }}>
                        See Features ↓
                    </a>
                </div>
            </section>

            {/* Features */}
            <section id="features" style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem 4rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 700, textAlign: 'center', marginBottom: '1rem' }}>Everything You Need</h2>
                <p style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '560px', margin: '0 auto 3rem', color: '#6B7280' }}>
                    Six powerful engines working together for institutional-grade portfolio analytics.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {features.map((f, i) => (
                        <div key={i} style={{
                            background: '#fff', padding: '1.5rem', borderRadius: '0.75rem',
                            border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            transition: 'all 0.2s',
                        }}>
                            <div style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{f.icon}</div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>{f.title}</h3>
                            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#6B7280' }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Tech Stack */}
            <section style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem 3rem' }}>
                <div style={{ background: '#F9FAFB', padding: '2rem', borderRadius: '0.75rem', textAlign: 'center', border: '1px solid #E5E7EB' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Built With Modern Tech</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem' }}>
                        {techs.map((t, i) => (
                            <span key={i} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', borderRadius: '0.5rem', color: '#374151', border: '1px solid #E5E7EB', background: '#fff' }}>{t}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem 1.5rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '1rem' }}>Try It Free</h2>
                <p style={{ marginBottom: '2rem', maxWidth: '480px', margin: '0 auto 2rem', color: '#6B7280' }}>
                    Create an account, build your portfolio, and explore risk analytics. No credit card required.
                </p>
                <Link to="/register" style={{ display: 'inline-block', padding: '0.875rem 2rem', fontSize: '1rem', fontWeight: 600, color: '#fff', background: '#059669', borderRadius: '0.75rem', textDecoration: 'none' }}>
                    Create Free Account
                </Link>
            </section>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid #E5E7EB', padding: '2rem', textAlign: 'center', fontSize: '0.875rem', color: '#9CA3AF' }}>
                <p>© 2026 Mini Aladdin by Divyanshi Vats. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
