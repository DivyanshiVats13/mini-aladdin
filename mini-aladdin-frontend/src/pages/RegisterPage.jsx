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
        if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
        if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
        setLoading(true);
        try {
            await register(email, password, fullName);
        } catch (err) {
            const msg = err.response?.data?.message || '';
            if (err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
                setError('Server is waking up — please wait 30 seconds and try again.');
            } else {
                setError(msg || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        background: '#fff',
        color: '#111827',
        border: '1px solid #D1D5DB',
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem 1rem',
            background: 'linear-gradient(135deg, #F0FDF4 0%, #F9FAFB 50%, #ECFDF5 100%)',
        }}>
            <div style={{ width: '100%', maxWidth: '420px' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#047857', marginBottom: '0.5rem' }}>
                        ✦ Mini Aladdin
                    </h1>
                    <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>Create your free account</p>
                </div>

                {/* Register Card */}
                <div style={{
                    background: '#fff',
                    borderRadius: '1rem',
                    padding: '2rem',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
                    border: '1px solid #E5E7EB',
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '1.5rem' }}>
                        Sign Up
                    </h2>

                    {error && (
                        <div style={{
                            marginBottom: '1rem', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem',
                            background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA',
                        }}>{error}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                                Full Name
                            </label>
                            <input id="register-name" type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                                required placeholder="John Doe"
                                style={{ ...inputStyle, width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                                Email
                            </label>
                            <input id="register-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                                required placeholder="you@example.com"
                                style={{ ...inputStyle, width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                                Password
                            </label>
                            <input id="register-password" type="password" value={password} onChange={e => setPassword(e.target.value)}
                                required placeholder="Min. 8 characters"
                                style={{ ...inputStyle, width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                                Confirm Password
                            </label>
                            <input id="register-confirm" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                                required placeholder="••••••••"
                                style={{ ...inputStyle, width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                        <button id="register-submit" type="submit" disabled={loading}
                            style={{
                                width: '100%', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600,
                                cursor: loading ? 'wait' : 'pointer', border: 'none',
                                background: loading ? '#9CA3AF' : '#059669', color: '#fff',
                                transition: 'all 0.2s',
                            }}>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#6B7280' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ fontWeight: 500, color: '#059669', textDecoration: 'none' }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
