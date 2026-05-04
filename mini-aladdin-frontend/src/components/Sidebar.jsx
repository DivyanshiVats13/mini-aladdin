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
            style={{ background: '#fff', borderColor: '#E5E7EB' }}>

            {/* Logo */}
            <div className="p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
                <h1 className="text-xl font-bold" style={{ color: '#047857' }}>
                    ✦ Mini Aladdin
                </h1>
                <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
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
                                color: isActive ? '#047857' : '#4B5563',
                                background: isActive ? '#ECFDF5' : 'transparent',
                                borderRight: isActive ? '3px solid #059669' : '3px solid transparent',
                                fontWeight: isActive ? 600 : 500,
                            }}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* User info + Logout */}
            <div className="p-4 border-t" style={{ borderColor: '#E5E7EB' }}>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background: '#D1FAE5', color: '#047857' }}>
                        {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: '#111827' }}>
                            {user?.fullName || 'User'}
                        </p>
                        <p className="text-xs truncate" style={{ color: '#6B7280' }}>
                            {user?.tier || 'FREE'} tier
                        </p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
                    style={{
                        color: '#4B5563',
                        background: '#F3F4F6',
                        border: '1px solid #E5E7EB',
                    }}
                    onMouseEnter={e => e.target.style.background = '#E5E7EB'}
                    onMouseLeave={e => e.target.style.background = '#F3F4F6'}
                >
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
