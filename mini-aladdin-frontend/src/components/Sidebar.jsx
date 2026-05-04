import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/portfolios', label: 'Portfolios', icon: '💼' },
    { path: '/risk', label: 'Risk Analytics', icon: '⚡' },
    { path: '/rebalance', label: 'Rebalance', icon: '⚖️' },
    { path: '/stress-test', label: 'Stress Test', icon: '🔥' },
];

export default function Sidebar() {
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <aside style={{
            position: 'fixed', top: 0, left: 0, height: '100vh', width: '256px',
            display: 'flex', flexDirection: 'column',
            background: '#fff', borderRight: '1px solid #E5E7EB',
            fontFamily: "'Inter', system-ui, sans-serif",
        }}>
            {/* Logo */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #E5E7EB' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#047857', margin: 0 }}>✦ Mini Aladdin</h1>
                <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: '#6B7280' }}>Portfolio Risk Engine</p>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '1rem 0', overflowY: 'auto' }}>
                {navItems.map(item => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <NavLink key={item.path} to={item.path}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '0.75rem 1.5rem', fontSize: '0.875rem',
                                textDecoration: 'none', transition: 'all 0.2s',
                                color: isActive ? '#047857' : '#4B5563',
                                background: isActive ? '#ECFDF5' : 'transparent',
                                borderRight: isActive ? '3px solid #059669' : '3px solid transparent',
                                fontWeight: isActive ? 600 : 500,
                            }}>
                            <span style={{ fontSize: '1.125rem' }}>{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* User info */}
            <div style={{ padding: '1rem', borderTop: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.875rem', fontWeight: 700, background: '#D1FAE5', color: '#047857',
                    }}>
                        {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user?.fullName || 'User'}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0 }}>{user?.tier || 'FREE'} tier</p>
                    </div>
                </div>
                <button onClick={logout}
                    style={{
                        width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
                        fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
                        color: '#4B5563', background: '#F3F4F6', border: '1px solid #E5E7EB',
                        transition: 'all 0.2s',
                    }}>
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
