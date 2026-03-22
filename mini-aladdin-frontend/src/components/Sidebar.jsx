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
        <aside className="fixed top-0 left-0 h-screen w-64 flex flex-col border-r"
            style={{
                background: 'var(--color-navy-900)',
                borderColor: 'var(--color-border)',
            }}>

            {/* Logo */}
            <div className="p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <h1 className="text-xl font-bold" style={{ color: 'var(--color-teal-400)' }}>
                    ✦ Mini Aladdin
                </h1>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                    Portfolio Risk Engine
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 overflow-y-auto">
                {navItems.map(item => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className="flex items-center gap-3 px-6 py-3 text-sm transition-all duration-200"
                            style={{
                                color: isActive ? 'var(--color-teal-400)' : 'var(--color-text-secondary)',
                                background: isActive ? 'rgba(20, 184, 166, 0.08)' : 'transparent',
                                borderRight: isActive ? '3px solid var(--color-teal-400)' : '3px solid transparent',
                            }}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* User info + Logout */}
            <div className="p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background: 'var(--color-teal-500)', color: 'var(--color-navy-950)' }}>
                        {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                            {user?.fullName || 'User'}
                        </p>
                        <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                            {user?.tier || 'FREE'} tier
                        </p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
                    style={{
                        color: 'var(--color-text-secondary)',
                        background: 'var(--color-navy-800)',
                        border: '1px solid var(--color-border)',
                    }}
                    onMouseEnter={e => e.target.style.background = 'var(--color-navy-700)'}
                    onMouseLeave={e => e.target.style.background = 'var(--color-navy-800)'}
                >
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
