import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
    const { register, isAuthenticated } = useAuth();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (isAuthenticated) return <Navigate to="/dashboard" replace />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        setLoading(true);
        try {
            await register(email, password, fullName);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
                        Create your account
                    </p>
                </div>

                {/* Register Card */}
                <div className="glass-card p-8">
                    <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-text-primary)' }}>
                        Sign Up
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
                                Full Name
                            </label>
                            <input
                                id="register-name"
                                type="text"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                                style={{
                                    background: 'var(--color-navy-800)',
                                    color: 'var(--color-text-primary)',
                                    border: '1px solid var(--color-border)',
                                }}
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                                Email
                            </label>
                            <input
                                id="register-email"
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

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                                Password
                            </label>
                            <input
                                id="register-password"
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
                                placeholder="Min. 8 characters"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                                Confirm Password
                            </label>
                            <input
                                id="register-confirm"
                                type="password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
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
                            id="register-submit"
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer"
                            style={{
                                background: loading ? 'var(--color-navy-600)' : 'var(--color-teal-500)',
                                color: 'var(--color-navy-950)',
                            }}
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium" style={{ color: 'var(--color-teal-400)' }}>
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
