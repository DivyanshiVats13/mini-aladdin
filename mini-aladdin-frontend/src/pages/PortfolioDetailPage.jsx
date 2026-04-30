import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import AddHoldingModal from '../components/AddHoldingModal';

export default function PortfolioDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddHolding, setShowAddHolding] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const fetchPortfolio = async () => {
        try {
            const res = await axiosClient.get(`/portfolios/${id}`);
            if (res.data?.success) setPortfolio(res.data.data);
        } catch (err) {
            console.error('Failed to fetch portfolio:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPortfolio(); }, [id]);

    const handleRemoveHolding = async (holdingId) => {
        if (!confirm('Remove this holding?')) return;
        try {
            await axiosClient.delete(`/portfolios/${id}/holdings/${holdingId}`);
            fetchPortfolio();
        } catch (err) {
            alert('Failed to remove holding');
        }
    };

    const handleDeletePortfolio = async () => {
        if (!confirm(`Delete "${portfolio.name}"? This will remove all holdings. This action cannot be undone.`)) return;
        setDeleting(true);
        try {
            await axiosClient.delete(`/portfolios/${id}`);
            navigate('/portfolios');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete portfolio');
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div>
                <div className="mb-8">
                    <div className="h-3 w-24 rounded mb-3" style={{ background: 'var(--color-navy-800)' }} />
                    <div className="h-8 w-48 rounded mb-2 animate-pulse" style={{ background: 'var(--color-navy-800)' }} />
                    <div className="h-4 w-32 rounded animate-pulse" style={{ background: 'var(--color-navy-800)' }} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="glass-card p-5 animate-pulse">
                            <div className="h-3 w-20 rounded mb-3" style={{ background: 'var(--color-navy-700)' }} />
                            <div className="h-7 w-28 rounded" style={{ background: 'var(--color-navy-700)' }} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!portfolio) {
        return (
            <div className="text-center py-12">
                <p className="text-4xl mb-4">🔍</p>
                <p style={{ color: 'var(--color-text-secondary)' }}>Portfolio not found</p>
                <Link to="/portfolios" className="text-sm mt-4 inline-block font-medium" style={{ color: 'var(--color-teal-400)' }}>
                    ← Back to portfolios
                </Link>
            </div>
        );
    }

    const holdings = portfolio.holdings || [];
    const totalPnLPct = portfolio.totalPnLPct || 0;

    return (
        <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <Link to="/portfolios" className="text-xs mb-2 inline-block font-medium" style={{ color: 'var(--color-teal-400)' }}>
                        ← Back to Portfolios
                    </Link>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                        {portfolio.name}
                    </h1>
                    <p className="mt-1" style={{ color: 'var(--color-text-muted)' }}>
                        {portfolio.currency || 'USD'} · Created {new Date(portfolio.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowAddHolding(true)}
                        className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer"
                        style={{ background: 'var(--color-teal-500)', color: 'var(--color-navy-950)' }}
                    >
                        + Add Holding
                    </button>
                    <button
                        onClick={handleDeletePortfolio}
                        disabled={deleting}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
                        style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: 'var(--color-red-500)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                        }}
                    >
                        {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <div className="glass-card p-5">
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Total Value</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--color-teal-400)' }}>
                        ${Number(portfolio.totalValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="glass-card p-5">
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Cost Basis</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                        ${Number(portfolio.totalCostBasis || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="glass-card p-5">
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Total P&L</p>
                    <p className="text-2xl font-bold"
                        style={{ color: (portfolio.totalPnL || 0) >= 0 ? 'var(--color-green-400)' : 'var(--color-red-500)' }}>
                        {(portfolio.totalPnL || 0) >= 0 ? '+' : ''}${Number(Math.abs(portfolio.totalPnL || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="glass-card p-5">
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Return %</p>
                    <p className="text-2xl font-bold"
                        style={{ color: totalPnLPct >= 0 ? 'var(--color-green-400)' : 'var(--color-red-500)' }}>
                        {totalPnLPct >= 0 ? '+' : ''}{Number(totalPnLPct).toFixed(2)}%
                    </p>
                </div>
                <div className="glass-card p-5">
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Holdings</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                        {holdings.length}
                    </p>
                </div>
            </div>

            {/* Holdings table */}
            {holdings.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <p className="text-4xl mb-4">📈</p>
                    <p style={{ color: 'var(--color-text-secondary)' }}>No holdings yet</p>
                    <p className="text-sm mt-1 mb-6" style={{ color: 'var(--color-text-muted)' }}>
                        Click "Add Holding" to add assets to this portfolio.
                    </p>
                    <button onClick={() => setShowAddHolding(true)}
                        className="px-6 py-2 rounded-lg text-sm font-semibold cursor-pointer"
                        style={{ background: 'var(--color-teal-500)', color: 'var(--color-navy-950)' }}>
                        + Add Your First Holding
                    </button>
                </div>
            ) : (
                <div className="glass-card overflow-hidden">
                    <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                        <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                            Holdings ({holdings.length})
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    {['Ticker', 'Name', 'Qty', 'Avg Cost', 'Current', 'Market Value', 'P&L', 'P&L %', 'Weight', ''].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-medium"
                                            style={{ color: 'var(--color-text-muted)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {holdings.map((h, i) => (
                                    <tr key={h.holdingId || i}
                                        className="transition-colors duration-150"
                                        style={{ borderBottom: '1px solid var(--color-border)' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(20, 184, 166, 0.03)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-teal-400)' }}>
                                            {h.ticker}
                                        </td>
                                        <td className="px-4 py-3" style={{ color: 'var(--color-text-secondary)' }}>
                                            {h.assetName || '—'}
                                        </td>
                                        <td className="px-4 py-3" style={{ color: 'var(--color-text-primary)' }}>
                                            {Number(h.quantity).toLocaleString('en-US')}
                                        </td>
                                        <td className="px-4 py-3" style={{ color: 'var(--color-text-primary)' }}>
                                            ${Number(h.avgBuyPrice || 0).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3" style={{ color: 'var(--color-text-primary)' }}>
                                            ${Number(h.currentPrice || h.avgBuyPrice || 0).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-text-primary)' }}>
                                            ${Number(h.marketValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-4 py-3 font-medium"
                                            style={{ color: (h.pnL || 0) >= 0 ? 'var(--color-green-400)' : 'var(--color-red-500)' }}>
                                            {(h.pnL || 0) >= 0 ? '+' : ''}${Number(Math.abs(h.pnL || 0)).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 font-medium"
                                            style={{ color: (h.pnLPct || 0) >= 0 ? 'var(--color-green-400)' : 'var(--color-red-500)' }}>
                                            {(h.pnLPct || 0) >= 0 ? '+' : ''}{Number(h.pnLPct || 0).toFixed(2)}%
                                        </td>
                                        <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>
                                            {Number(h.weightPct || 0).toFixed(1)}%
                                        </td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => handleRemoveHolding(h.holdingId)}
                                                className="text-xs px-2 py-1 rounded cursor-pointer transition-all duration-200"
                                                style={{ color: 'var(--color-red-500)', background: 'rgba(239,68,68,0.1)' }}
                                                onMouseEnter={e => e.target.style.background = 'rgba(239,68,68,0.2)'}
                                                onMouseLeave={e => e.target.style.background = 'rgba(239,68,68,0.1)'}>
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Quick analysis links */}
            {holdings.length > 0 && (
                <div className="flex gap-3 mt-6">
                    <Link to="/risk"
                        className="glass-card px-4 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
                        style={{ color: 'var(--color-text-secondary)' }}>
                        ⚡ Risk Analysis
                    </Link>
                    <Link to="/rebalance"
                        className="glass-card px-4 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
                        style={{ color: 'var(--color-text-secondary)' }}>
                        ⚖️ Rebalance
                    </Link>
                    <Link to="/stress-test"
                        className="glass-card px-4 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
                        style={{ color: 'var(--color-text-secondary)' }}>
                        🔥 Stress Test
                    </Link>
                </div>
            )}

            {/* Add Holding Modal */}
            {showAddHolding && (
                <AddHoldingModal
                    portfolioId={id}
                    onClose={() => setShowAddHolding(false)}
                    onAdded={fetchPortfolio}
                />
            )}
        </div>
    );
}
