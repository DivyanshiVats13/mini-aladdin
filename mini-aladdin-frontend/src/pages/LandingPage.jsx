import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (user) return <Navigate to="/dashboard" replace />;

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            if (err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
                setError('Server is waking up — please wait 30s and try again.');
            } else {
                setError(err.response?.data?.message || 'Invalid credentials.');
            }
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: '💼', title: 'Portfolio Management', desc: 'Create portfolios, add holdings, and track P&L with live market prices.' },
        { icon: '📊', title: 'Risk Analytics', desc: 'Beta, Volatility, Sharpe Ratio, and Value-at-Risk — calculated in real time.' },
        { icon: '⚖️', title: 'Auto Rebalance', desc: 'Detect allocation drift and get BUY/SELL recommendations.' },
        { icon: '🔥', title: 'Stress Testing', desc: 'Simulate 2008 Crisis, COVID Crash, Dot-com Burst against your portfolio.' },
    ];

    const inputStyle = {
        width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem',
        fontSize: '0.875rem', border: '1px solid #D1D5DB', background: '#fff',
        color: '#111827', outline: 'none', boxSizing: 'border-box',
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F0FDF4 0%, #F9FAFB 50%, #ECFDF5 100%)', fontFamily: "'Inter', system-ui, sans-serif" }}>

            {/* Main content — two columns */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: '100vh', padding: '2rem', gap: '4rem', flexWrap: 'wrap',
                maxWidth: '1100px', margin: '0 auto',
            }}>

                {/* Left — Project description */}
                <div style={{ flex: '1 1 400px', maxWidth: '520px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#059669', color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>MA</div>
                        <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>Mini Aladdin</span>
                    </div>

                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.15, color: '#111827', marginBottom: '1rem' }}>
                        Portfolio <span style={{ color: '#059669' }}>Risk Analytics</span>
                    </h1>
                    <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#4B5563', marginBottom: '2.5rem' }}>
                        A full-stack portfolio management platform with real-time risk metrics,
                        automated rebalancing, and historical crash stress testing.
                        Inspired by BlackRock Aladdin.
                    </p>

                    {/* Feature cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {features.map((f, i) => (
                            <div key={i} style={{
                                background: '#fff', padding: '1rem', borderRadius: '0.75rem',
                                border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            }}>
                                <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{f.icon}</div>
                                <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>{f.title}</h3>
                                <p style={{ fontSize: '0.75rem', lineHeight: 1.5, color: '#6B7280', margin: 0 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>

                    <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '2rem' }}>
                        Built with Spring Boot 3.4 · React 19 · PostgreSQL · JWT Auth
                    </p>
                </div>

                {/* Right — Login form */}
                <div style={{ flex: '0 0 380px', maxWidth: '400px', width: '100%' }}>
                    <div style={{
                        background: '#fff', borderRadius: '1rem', padding: '2rem',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
                        border: '1px solid #E5E7EB',
                    }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>Sign In</h2>
                        <p style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '1.5rem' }}>Log in to explore portfolios and analytics</p>

                        {error && (
                            <div style={{
                                marginBottom: '1rem', padding: '0.75rem 1rem', borderRadius: '0.5rem',
                                fontSize: '0.875rem', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA',
                            }}>{error}</div>
                        )}

                        <form onSubmit={handleLogin}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>Email</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                    required placeholder="you@example.com" style={inputStyle} />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>Password</label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                                    required placeholder="••••••••" style={inputStyle} />
                            </div>
                            <button type="submit" disabled={loading}
                                style={{
                                    width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
                                    fontSize: '0.875rem', fontWeight: 600, border: 'none',
                                    background: loading ? '#9CA3AF' : '#059669', color: '#fff',
                                    cursor: loading ? 'wait' : 'pointer', transition: 'all 0.2s',
                                }}>
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>
                    </div>

                    {/* Footer */}
                    <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9CA3AF', marginTop: '1.5rem' }}>
                        © 2026 Mini Aladdin — by Divyanshi Vats
                    </p>
                </div>
            </div>
        </div>
    );
}
