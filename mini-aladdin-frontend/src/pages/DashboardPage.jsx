import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

const C = { primary: '#059669', primaryDk: '#047857', txt: '#111827', sub: '#4B5563', muted: '#6B7280', border: '#E5E7EB', bg2: '#F3F4F6', green: '#16A34A', red: '#DC2626' };

export default function DashboardPage() {
    const { user } = useAuth();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosClient.get('/dashboard/summary')
            .then(res => { if (res.data?.success) setSummary(res.data.data); })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const totalValue = summary?.totalValue || 0;
    const totalPnL = summary?.totalPnL || 0;
    const totalPnLPct = summary?.totalPnLPct || 0;
    const beta = summary?.portfolioBeta || 1.0;
    const sharpe = summary?.sharpeRatio || 0;
    const topHoldings = summary?.topHoldings || [];

    if (loading) {
        return (
            <div>
                <div className="mb-8">
                    <div className="h-8 w-64 rounded-lg mb-2 animate-pulse" style={{ background: C.bg2 }} />
                    <div className="h-4 w-48 rounded animate-pulse" style={{ background: C.bg2 }} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="card p-5 animate-pulse">
                            <div className="h-3 w-20 rounded mb-3" style={{ background: C.bg2 }} />
                            <div className="h-7 w-32 rounded mb-2" style={{ background: C.bg2 }} />
                            <div className="h-3 w-16 rounded" style={{ background: C.bg2 }} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold" style={{ color: C.txt }}>
                    Welcome back, {user?.fullName?.split(' ')[0] || 'User'} 👋
                </h1>
                <p className="mt-1" style={{ color: C.muted }}>Here's your portfolio overview</p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard label="Total Value"
                    value={`$${Number(totalValue).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    change={`${totalPnLPct >= 0 ? '+' : ''}${Number(totalPnLPct).toFixed(2)}%`}
                    positive={totalPnLPct >= 0} />
                <StatCard label="Total P&L"
                    value={`${totalPnL >= 0 ? '+' : ''}$${Number(Math.abs(totalPnL)).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    change={`${totalPnLPct >= 0 ? '+' : ''}${Number(totalPnLPct).toFixed(2)}%`}
                    positive={totalPnL >= 0} />
                <StatCard label="Portfolio Beta" value={Number(beta).toFixed(2)}
                    subtitle={Number(beta) > 1 ? 'Higher than market' : Number(beta) < 1 ? 'Lower than market' : 'Market-like risk'} />
                <StatCard label="Sharpe Ratio" value={Number(sharpe).toFixed(2)} subtitle="Risk-adjusted return" />
            </div>

            {/* Top Holdings + Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold" style={{ color: C.txt }}>📊 Top Holdings</h3>
                        {topHoldings.length > 0 && (
                            <Link to="/portfolios" className="text-xs font-medium" style={{ color: C.primary }}>View all →</Link>
                        )}
                    </div>
                    {topHoldings.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-3xl mb-3">💼</p>
                            <p className="text-sm mb-2" style={{ color: C.sub }}>No holdings yet</p>
                            <Link to="/portfolios" className="text-sm font-medium" style={{ color: C.primary }}>Create your first portfolio →</Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {topHoldings.map((h, i) => (
                                <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${C.border}` }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                                            style={{ background: '#ECFDF5', color: C.primaryDk }}>{i + 1}</div>
                                        <div>
                                            <span className="font-semibold text-sm" style={{ color: C.primaryDk }}>{h.ticker}</span>
                                            <span className="text-xs ml-2" style={{ color: C.muted }}>{h.name}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium" style={{ color: C.txt }}>
                                            ${Number(h.marketValue).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </p>
                                        <p className="text-xs" style={{ color: Number(h.pnL) >= 0 ? C.green : C.red }}>
                                            {Number(h.pnL) >= 0 ? '+' : ''}${Number(h.pnL).toFixed(2)} ({h.weightPct}%)
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="card p-6">
                    <h3 className="text-base font-semibold mb-4" style={{ color: C.txt }}>📈 Quick Stats</h3>
                    <div className="space-y-4">
                        <QS label="Portfolios" value={summary?.portfolioCount || 0} />
                        <QS label="Total Holdings" value={summary?.holdingCount || 0} />
                        <QS label="Cost Basis" value={`$${Number(summary?.totalCostBasis || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`} />
                        <QS label="P&L %" value={`${Number(totalPnLPct) >= 0 ? '+' : ''}${Number(totalPnLPct).toFixed(2)}%`}
                            color={Number(totalPnLPct) >= 0 ? C.green : C.red} />
                    </div>
                    <div className="mt-6 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
                        <p className="text-xs font-medium mb-3" style={{ color: C.muted }}>Quick Actions</p>
                        <div className="flex flex-wrap gap-2">
                            <QL to="/portfolios" label="+ New Portfolio" />
                            <QL to="/risk" label="Risk Analysis" />
                            <QL to="/stress-test" label="Stress Test" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, change, positive, subtitle }) {
    return (
        <div className="card p-5 transition-all duration-300 hover:shadow-md">
            <p className="text-xs font-medium mb-1" style={{ color: C.muted }}>{label}</p>
            <p className="text-2xl font-bold" style={{ color: C.txt }}>{value}</p>
            {change && <p className="text-xs font-medium mt-1" style={{ color: positive ? C.green : C.red }}>{change}</p>}
            {subtitle && <p className="text-xs mt-1" style={{ color: C.muted }}>{subtitle}</p>}
        </div>
    );
}

function QS({ label, value, color }) {
    return (
        <div className="flex justify-between">
            <span className="text-sm" style={{ color: C.muted }}>{label}</span>
            <span className="text-sm font-semibold" style={{ color: color || C.txt }}>{value}</span>
        </div>
    );
}

function QL({ to, label }) {
    return (
        <Link to={to} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: '#F3F4F6', color: C.sub, border: `1px solid ${C.border}` }}>{label}</Link>
    );
}
