import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div>
            {/* Welcome header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    Welcome back, {user?.fullName?.split(' ')[0] || 'User'} 👋
                </h1>
                <p className="mt-1" style={{ color: 'var(--color-text-muted)' }}>
                    Here's your portfolio overview
                </p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard label="Total Value" value="$0.00" change="+0.00%" positive />
                <StatCard label="Daily P&L" value="$0.00" change="0.00%" positive />
                <StatCard label="Portfolio Beta" value="1.00" subtitle="Market-like risk" />
                <StatCard label="Sharpe Ratio" value="0.00" subtitle="Risk-adjusted return" />
            </div>

            {/* Placeholder sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                        📊 Portfolio Breakdown
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        Create a portfolio and add holdings to see your breakdown here.
                    </p>
                </div>

                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                        📈 Recent Activity
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        Your recent trades and rebalancing actions will appear here.
                    </p>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, change, positive, subtitle }) {
    return (
        <div className="glass-card p-5">
            <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>
                {label}
            </p>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                {value}
            </p>
            {change && (
                <p className="text-xs font-medium mt-1"
                    style={{ color: positive ? 'var(--color-green-400)' : 'var(--color-red-500)' }}>
                    {change}
                </p>
            )}
            {subtitle && (
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                    {subtitle}
                </p>
            )}
        </div>
    );
}
