import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [demoLoading, setDemoLoading] = useState(false);
    const [demoError, setDemoError] = useState('');

    if (user) return <Navigate to="/dashboard" replace />;

    const handleDemoLogin = async () => {
        setDemoLoading(true);
        setDemoError('');
        try {
            await login('demo@minialaddin.com', 'Demo1234!');
            navigate('/dashboard');
        } catch (err) {
            if (err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
                setDemoError('Server is waking up — please wait 30s and try again.');
            } else {
                setDemoError('Demo unavailable right now. Try signing in manually.');
            }
        } finally {
            setDemoLoading(false);
        }
    };

    const features = [
        { icon: '💼', title: 'Portfolio Management', desc: 'Create portfolios with multiple holdings, track P&L with live market prices from Yahoo Finance.' },
        { icon: '📊', title: 'Risk Analytics', desc: 'Portfolio Beta, Volatility, Sharpe Ratio, and 95% Value-at-Risk — calculated in real time.' },
        { icon: '⚖️', title: 'Auto Rebalance', desc: 'Detect allocation drift and get BUY/SELL recommendations to match your target weights.' },
        { icon: '🔥', title: 'Stress Testing', desc: 'Simulate 2008 Crisis, COVID Crash, Dot-com Burst, and more against your portfolio.' },
        { icon: '📈', title: 'Live Market Data', desc: 'Real-time stock prices with 5-minute caching via Yahoo Finance API. No API keys needed.' },
        { icon: '🔐', title: 'Secure by Default', desc: 'JWT authentication, BCrypt password hashing, Spring Security, and stateless sessions.' },
    ];

    const techStack = [
        { name: 'Spring Boot 3.4', role: 'Backend API' },
        { name: 'React 19', role: 'Frontend SPA' },
        { name: 'PostgreSQL', role: 'Database' },
        { name: 'Neon', role: 'Serverless DB' },
        { name: 'Tailwind CSS 4', role: 'Styling' },
        { name: 'JWT + Spring Security', role: 'Auth' },
        { name: 'Yahoo Finance API', role: 'Market Data' },
        { name: 'Docker', role: 'Containerization' },
        { name: 'Vite', role: 'Build Tool' },
        { name: 'Render', role: 'Backend Hosting' },
        { name: 'Vercel', role: 'Frontend Hosting' },
    ];

    const architecture = [
        { label: 'Frontend', items: ['React 19 SPA', 'Vite build', 'Axios HTTP client', 'Context API auth'] },
        { label: 'Backend', items: ['Spring Boot 3.4 REST API', '8 controllers', '6 service engines', 'JPA + Hibernate'] },
        { label: 'Database', items: ['PostgreSQL 16 (Neon)', 'UUID primary keys', 'Cascading relations', 'Auto-migration'] },
        { label: 'Security', items: ['JWT stateless auth', 'BCrypt hashing', 'CORS whitelisting', 'Role-based access'] },
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#fff', color: '#111827', fontFamily: "'Inter', system-ui, sans-serif" }}>

            {/* Nav */}
            <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 3rem', borderBottom: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#059669', color: '#fff', fontWeight: 700, fontSize: '0.875rem' }}>MA</div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>Mini Aladdin</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 500, padding: '0.2rem 0.5rem', background: '#ECFDF5', color: '#047857', borderRadius: '4px', marginLeft: '0.25rem' }}>PROJECT</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <a href="https://github.com/DivyanshiVats13/mini-aladdin" target="_blank" rel="noopener noreferrer"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, color: '#4B5563', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="#4B5563"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
                        GitHub
                    </a>
                    <Link to="/login" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, color: '#4B5563', textDecoration: 'none' }}>Sign In</Link>
                </div>
            </nav>

            {/* Hero */}
            <section style={{ maxWidth: '900px', margin: '0 auto', padding: '5rem 1.5rem 3.5rem', textAlign: 'center' }}>
                <div style={{ display: 'inline-block', padding: '0.375rem 1rem', marginBottom: '1.5rem', fontSize: '0.75rem', fontWeight: 500, borderRadius: '9999px', color: '#047857', background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
                    ✦ Full-Stack Portfolio Risk Engine — Built by Divyanshi Vats
                </div>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.5rem' }}>
                    Portfolio <span style={{ color: '#059669' }}>Risk Analytics</span>
                    <br />
                    <span style={{ fontSize: '1.75rem', fontWeight: 500, color: '#6B7280' }}>Inspired by BlackRock Aladdin</span>
                </h1>
                <p style={{ fontSize: '1.125rem', maxWidth: '640px', margin: '0 auto 2rem', lineHeight: 1.7, color: '#4B5563' }}>
                    A production-grade portfolio management platform with real-time risk metrics,
                    automated rebalancing, and historical crash stress testing.
                    Built with Spring Boot + React + PostgreSQL.
                </p>

                {/* CTA Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    <button
                        onClick={handleDemoLogin}
                        disabled={demoLoading}
                        style={{
                            padding: '0.875rem 2rem', fontSize: '1rem', fontWeight: 600,
                            color: '#fff', background: demoLoading ? '#9CA3AF' : '#059669',
                            borderRadius: '0.75rem', border: 'none',
                            cursor: demoLoading ? 'wait' : 'pointer',
                            transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem',
                        }}
                    >
                        {demoLoading ? (
                            <>⏳ Logging in...</>
                        ) : (
                            <>▶ Try Live Demo</>
                        )}
                    </button>
                    <a href="https://github.com/DivyanshiVats13/mini-aladdin" target="_blank" rel="noopener noreferrer"
                        style={{ padding: '0.875rem 2rem', fontSize: '1rem', fontWeight: 500, borderRadius: '0.75rem', color: '#4B5563', border: '1px solid #D1D5DB', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="18" height="18" viewBox="0 0 16 16" fill="#4B5563"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
                        View Source Code
                    </a>
                </div>

                {demoError && (
                    <p style={{ fontSize: '0.875rem', color: '#DC2626', marginTop: '0.5rem' }}>{demoError}</p>
                )}

                <p style={{ fontSize: '0.8rem', color: '#9CA3AF', marginTop: '0.75rem' }}>
                    Demo logs in instantly as a pre-made user — no registration needed.
                </p>
            </section>

            {/* What This Project Does */}
            <section style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem 3rem' }}>
                <div style={{ background: '#F0FDF4', border: '1px solid #A7F3D0', borderRadius: '0.75rem', padding: '2rem', lineHeight: 1.8 }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#047857', marginBottom: '1rem' }}>📌 What This Project Demonstrates</h2>
                    <p style={{ fontSize: '0.95rem', color: '#374151' }}>
                        This is a <strong>full-stack web application</strong> inspired by BlackRock's Aladdin system — the world's largest
                        portfolio risk management platform. Mini Aladdin implements a miniature version with real market data, risk calculations,
                        and automated portfolio rebalancing. It showcases <strong>production-grade architecture</strong>: REST API design,
                        JWT authentication, relational database modeling, external API integration, and a responsive React frontend — all
                        deployed live with CI/CD.
                    </p>
                </div>
            </section>

            {/* Features */}
            <section id="features" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.75rem' }}>Core Features</h2>
                <p style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '560px', margin: '0 auto 3rem', color: '#6B7280' }}>
                    Six integrated engines working together for portfolio analytics.
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

            {/* Architecture */}
            <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem 3rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '2rem' }}>System Architecture</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                    {architecture.map((block, i) => (
                        <div key={i} style={{ background: '#F9FAFB', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #E5E7EB' }}>
                            <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#059669', marginBottom: '1rem' }}>{block.label}</h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {block.items.map((item, j) => (
                                    <li key={j} style={{ fontSize: '0.875rem', color: '#374151', padding: '0.3rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ color: '#059669', fontSize: '0.6rem' }}>●</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Tech Stack */}
            <section style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem 3rem' }}>
                <div style={{ background: '#F9FAFB', padding: '2rem', borderRadius: '0.75rem', textAlign: 'center', border: '1px solid #E5E7EB' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Tech Stack</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem' }}>
                        {techStack.map((t, i) => (
                            <span key={i} style={{
                                padding: '0.5rem 1rem', fontSize: '0.825rem', borderRadius: '0.5rem',
                                color: '#374151', border: '1px solid #E5E7EB', background: '#fff',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem',
                            }}>
                                <strong>{t.name}</strong>
                                <span style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>{t.role}</span>
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Try Demo CTA */}
            <section style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem 1.5rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '1rem' }}>Try It Live</h2>
                <p style={{ marginBottom: '2rem', maxWidth: '480px', margin: '0 auto 1.5rem', color: '#6B7280' }}>
                    Click below to log in with a pre-made demo account and explore all features — portfolios, risk metrics, rebalancing, and stress tests.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={handleDemoLogin}
                        disabled={demoLoading}
                        style={{
                            padding: '0.875rem 2rem', fontSize: '1rem', fontWeight: 600,
                            color: '#fff', background: demoLoading ? '#9CA3AF' : '#059669',
                            borderRadius: '0.75rem', border: 'none',
                            cursor: demoLoading ? 'wait' : 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        {demoLoading ? '⏳ Logging in...' : '▶ Try Live Demo'}
                    </button>
                    <Link to="/register"
                        style={{ padding: '0.875rem 2rem', fontSize: '1rem', fontWeight: 500, borderRadius: '0.75rem', color: '#4B5563', border: '1px solid #D1D5DB', textDecoration: 'none' }}>
                        Or Create Your Own Account
                    </Link>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '1rem' }}>
                    Demo credentials: demo@minialaddin.com / Demo1234!
                </p>
            </section>

            {/* Built By */}
            <section style={{ maxWidth: '700px', margin: '0 auto', padding: '1rem 1.5rem 2rem', textAlign: 'center' }}>
                <div style={{ background: '#F9FAFB', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #E5E7EB' }}>
                    <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>Built by Divyanshi Vats</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <a href="https://github.com/DivyanshiVats13" target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: '0.85rem', color: '#059669', textDecoration: 'none', fontWeight: 500 }}>
                            GitHub ↗
                        </a>
                        <a href="https://github.com/DivyanshiVats13/mini-aladdin" target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: '0.85rem', color: '#059669', textDecoration: 'none', fontWeight: 500 }}>
                            Source Code ↗
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid #E5E7EB', padding: '2rem', textAlign: 'center', fontSize: '0.875rem', color: '#9CA3AF' }}>
                <p>© 2026 Mini Aladdin — A portfolio project by Divyanshi Vats. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
