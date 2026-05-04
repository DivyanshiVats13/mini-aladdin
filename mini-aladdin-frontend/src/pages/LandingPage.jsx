import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function LandingPage() {
    const { user } = useAuth();

    // If already logged in, redirect to dashboard
    if (user) return <Navigate to="/dashboard" replace />;

    return (
        <div className="min-h-screen bg-navy-950 text-text-primary overflow-hidden">

            {/* ── Animated background gradient ── */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-teal-500/10 blur-[120px] animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-teal-400/5 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* ── Nav ── */}
            <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                        MA
                    </div>
                    <span className="text-xl font-bold tracking-tight">Mini Aladdin</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
                        Sign In
                    </Link>
                    <Link to="/register" className="px-5 py-2.5 text-sm font-medium bg-teal-500 text-white rounded-lg hover:bg-teal-400 transition-all hover:shadow-lg hover:shadow-teal-500/20">
                        Get Started Free
                    </Link>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 md:pt-32 pb-16 text-center">
                <div className="inline-block px-4 py-1.5 mb-6 text-xs font-medium text-teal-300 border border-teal-500/30 rounded-full bg-teal-500/10">
                    ✦ Portfolio Risk & Rebalancing Engine
                </div>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                    Smarter Portfolio
                    <span className="bg-gradient-to-r from-teal-400 to-green-300 bg-clip-text text-transparent"> Risk Analytics</span>
                </h1>
                <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
                    Real-time risk metrics, automated rebalancing, and historical stress testing — all in one platform. Built for investors who want data-driven decisions.
                </p>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                    <Link to="/register" className="px-8 py-3.5 text-base font-semibold bg-gradient-to-r from-teal-500 to-teal-400 text-white rounded-xl hover:shadow-xl hover:shadow-teal-500/25 transition-all hover:-translate-y-0.5">
                        Start Free — No Credit Card
                    </Link>
                    <a href="#features" className="px-8 py-3.5 text-base font-medium text-text-secondary border border-border rounded-xl hover:border-teal-500/50 hover:text-teal-400 transition-all">
                        See Features ↓
                    </a>
                </div>
            </section>

            {/* ── Features ── */}
            <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-20">
                <h2 className="text-3xl font-bold text-center mb-4">Everything You Need</h2>
                <p className="text-text-secondary text-center mb-14 max-w-xl mx-auto">Six powerful engines working together to give you institutional-grade portfolio analytics.</p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { icon: '💼', title: 'Portfolio Management', desc: 'Create portfolios, add holdings, track P&L with live market prices from Yahoo Finance.' },
                        { icon: '📊', title: 'Risk Analytics', desc: 'Portfolio Beta, Volatility, Sharpe Ratio, and 95% Value at Risk — calculated in real time.' },
                        { icon: '⚖️', title: 'Auto Rebalance', desc: 'Detect allocation drift and get BUY/SELL recommendations to match your target weights.' },
                        { icon: '🔥', title: 'Stress Testing', desc: 'Simulate 2008 Crisis, COVID crash, Dot-com burst, and more against your portfolio.' },
                        { icon: '📈', title: 'Live Market Data', desc: 'Real-time stock prices with 5-minute caching. No API keys needed.' },
                        { icon: '🔐', title: 'Secure by Default', desc: 'JWT authentication, encrypted passwords, and stateless session management.' },
                    ].map((f, i) => (
                        <div key={i} className="glass-card p-6 hover:border-teal-500/40 transition-all hover:-translate-y-1 group cursor-default">
                            <div className="text-3xl mb-4">{f.icon}</div>
                            <h3 className="text-lg font-semibold mb-2 group-hover:text-teal-400 transition-colors">{f.title}</h3>
                            <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Tech Stack ── */}
            <section className="relative z-10 max-w-4xl mx-auto px-6 py-16">
                <div className="glass-card p-8 text-center">
                    <h2 className="text-2xl font-bold mb-6">Built With Modern Tech</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {['Spring Boot 3.4', 'React 19', 'PostgreSQL', 'Tailwind CSS 4', 'JWT Auth', 'Yahoo Finance API', 'Vite', 'Docker'].map((tech, i) => (
                            <span key={i} className="px-4 py-2 text-sm text-text-secondary border border-border rounded-lg hover:border-teal-500/40 hover:text-teal-400 transition-all">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Feedback / CTA ── */}
            <section className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center">
                <h2 className="text-3xl font-bold mb-4">Try It Free</h2>
                <p className="text-text-secondary mb-8 max-w-lg mx-auto">
                    Create an account, build your portfolio, and explore risk analytics. No credit card required. We'd love your feedback!
                </p>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                    <Link to="/register" className="px-8 py-3.5 text-base font-semibold bg-gradient-to-r from-teal-500 to-teal-400 text-white rounded-xl hover:shadow-xl hover:shadow-teal-500/25 transition-all hover:-translate-y-0.5">
                        Create Free Account
                    </Link>
                    <a href="https://forms.gle/YOUR_FORM_ID" target="_blank" rel="noopener noreferrer" className="px-8 py-3.5 text-base font-medium text-teal-400 border border-teal-500/40 rounded-xl hover:bg-teal-500/10 transition-all">
                        Share Feedback ↗
                    </a>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="relative z-10 border-t border-border py-8 text-center text-sm text-text-muted">
                <p>© 2026 Mini Aladdin by Divyanshi Vats. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
