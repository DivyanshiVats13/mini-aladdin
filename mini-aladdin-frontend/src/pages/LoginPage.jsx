import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const { login, isAuthenticated } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (isAuthenticated) return <Navigate to="/dashboard" replace />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4"
            style={{ background: 'var(--color-navy-950)' }}>
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-teal-400)' }}>
                        ✦ Mini Aladdin
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        Portfolio Risk & Rebalancing Engine
                    </p>
                </div>

                {/* Login Card */}
                <div className="glass-card p-8">
                    <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-text-primary)' }}>
                        Sign In
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg text-sm"
                            style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-red-500)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                                Email
                            </label>
                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                                style={{
                                    background: 'var(--color-navy-800)',
                                    color: 'var(--color-text-primary)',
                                    border: '1px solid var(--color-border)',
                                }}
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                                Password
                            </label>
                            <input
                                id="login-password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                                style={{
                                    background: 'var(--color-navy-800)',
                                    color: 'var(--color-text-primary)',
                                    border: '1px solid var(--color-border)',
                                }}
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            id="login-submit"
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer"
                            style={{
                                background: loading ? 'var(--color-navy-600)' : 'var(--color-teal-500)',
                                color: 'var(--color-navy-950)',
                            }}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium" style={{ color: 'var(--color-teal-400)' }}>
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
