import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function LandingPage() {
    const { user } = useAuth();
    if (user) return <Navigate to="/dashboard" replace />;

    return (
        <div className="min-h-screen" style={{ background: '#fff', color: '#111827' }}>

            {/* Nav */}
            <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b" style={{ borderColor: '#E5E7EB' }}>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                        style={{ background: '#059669' }}>MA</div>
                    <span className="text-xl font-bold" style={{ color: '#111827' }}>Mini Aladdin</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="px-4 py-2 text-sm font-medium" style={{ color: '#4B5563' }}>Sign In</Link>
                    <Link to="/register" className="px-5 py-2.5 text-sm font-medium rounded-lg text-white transition-all hover:shadow-lg"
                        style={{ background: '#059669' }}>Get Started Free</Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="max-w-5xl mx-auto px-6 pt-20 md:pt-28 pb-16 text-center">
                <div className="inline-block px-4 py-1.5 mb-6 text-xs font-medium rounded-full"
                    style={{ color: '#047857', background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
                    ✦ Portfolio Risk & Rebalancing Engine
                </div>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6" style={{ color: '#111827' }}>
                    Smarter Portfolio{' '}
                    <span style={{ color: '#059669' }}>Risk Analytics</span>
                </h1>
                <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: '#4B5563' }}>
                    Real-time risk metrics, automated rebalancing, and historical stress testing — all in one platform. Built for investors who want data-driven decisions.
                </p>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                    <Link to="/register" className="px-8 py-3.5 text-base font-semibold text-white rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg"
                        style={{ background: '#059669' }}>Start Free — No Credit Card</Link>
                    <a href="#features" className="px-8 py-3.5 text-base font-medium rounded-xl transition-all"
                        style={{ color: '#4B5563', border: '1px solid #D1D5DB' }}>See Features ↓</a>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="max-w-6xl mx-auto px-6 py-20">
                <h2 className="text-3xl font-bold text-center mb-4" style={{ color: '#111827' }}>Everything You Need</h2>
                <p className="text-center mb-14 max-w-xl mx-auto" style={{ color: '#6B7280' }}>
                    Six powerful engines working together for institutional-grade portfolio analytics.
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { icon: '💼', title: 'Portfolio Management', desc: 'Create portfolios, add holdings, track P&L with live market prices from Yahoo Finance.' },
                        { icon: '📊', title: 'Risk Analytics', desc: 'Portfolio Beta, Volatility, Sharpe Ratio, and 95% Value at Risk — calculated in real time.' },
                        { icon: '⚖️', title: 'Auto Rebalance', desc: 'Detect allocation drift and get BUY/SELL recommendations to match your target weights.' },
                        { icon: '🔥', title: 'Stress Testing', desc: 'Simulate 2008 Crisis, COVID crash, Dot-com burst, and more against your portfolio.' },
                        { icon: '📈', title: 'Live Market Data', desc: 'Real-time stock prices with 5-minute caching. No API keys needed.' },
                        { icon: '🔐', title: 'Secure by Default', desc: 'JWT authentication, encrypted passwords, and stateless session management.' },
                    ].map((f, i) => (
                        <div key={i} className="card p-6 transition-all hover:-translate-y-1 group cursor-default">
                            <div className="text-3xl mb-4">{f.icon}</div>
                            <h3 className="text-lg font-semibold mb-2" style={{ color: '#111827' }}>{f.title}</h3>
                            <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Tech Stack */}
            <section className="max-w-4xl mx-auto px-6 py-16">
                <div className="card p-8 text-center">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: '#111827' }}>Built With Modern Tech</h2>
                    <div className="flex flex-wrap justify-center gap-3">
                        {['Spring Boot 3.4', 'React 19', 'PostgreSQL', 'Tailwind CSS 4', 'JWT Auth', 'Yahoo Finance API', 'Vite', 'Docker'].map((tech, i) => (
                            <span key={i} className="px-4 py-2 text-sm rounded-lg"
                                style={{ color: '#374151', border: '1px solid #E5E7EB', background: '#F9FAFB' }}>{tech}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-3xl mx-auto px-6 py-20 text-center">
                <h2 className="text-3xl font-bold mb-4" style={{ color: '#111827' }}>Try It Free</h2>
                <p className="mb-8 max-w-lg mx-auto" style={{ color: '#6B7280' }}>
                    Create an account, build your portfolio, and explore risk analytics. No credit card required.
                </p>
                <Link to="/register" className="inline-block px-8 py-3.5 text-base font-semibold text-white rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ background: '#059669' }}>Create Free Account</Link>
            </section>

            {/* Footer */}
            <footer className="border-t py-8 text-center text-sm" style={{ borderColor: '#E5E7EB', color: '#9CA3AF' }}>
                <p>© 2026 Mini Aladdin by Divyanshi Vats. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
