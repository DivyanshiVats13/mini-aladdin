import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import AddHoldingModal from '../components/AddHoldingModal';

export default function PortfolioDetailPage() {
    const { id } = useParams();
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddHolding, setShowAddHolding] = useState(false);

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

    if (loading) {
        return <div className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>Loading portfolio...</div>;
    }

    if (!portfolio) {
        return (
            <div className="text-center py-12">
                <p style={{ color: 'var(--color-text-secondary)' }}>Portfolio not found</p>
                <Link to="/portfolios" className="text-sm mt-2 inline-block" style={{ color: 'var(--color-teal-400)' }}>
                    ← Back to portfolios
                </Link>
            </div>
        );
    }

    const holdings = portfolio.holdings || [];

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Link to="/portfolios" className="text-xs mb-2 inline-block" style={{ color: 'var(--color-teal-400)' }}>
                        ← Back to Portfolios
                    </Link>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                        {portfolio.name}
                    </h1>
                    <p className="mt-1" style={{ color: 'var(--color-text-muted)' }}>
                        {portfolio.description || 'No description'}
                    </p>
                </div>
                <button
                    onClick={() => setShowAddHolding(true)}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer"
                    style={{ background: 'var(--color-teal-500)', color: 'var(--color-navy-950)' }}
                >
                    + Add Holding
                </button>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-card p-5">
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Total Value</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--color-teal-400)' }}>
                        ${(portfolio.totalValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="glass-card p-5">
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Total P&L</p>
                    <p className="text-2xl font-bold"
                        style={{ color: (portfolio.totalPnl || 0) >= 0 ? 'var(--color-green-400)' : 'var(--color-red-500)' }}>
                        ${(portfolio.totalPnl || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                    <p style={{ color: 'var(--color-text-secondary)' }}>No holdings yet</p>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                        Click "Add Holding" to add assets to this portfolio.
                    </p>
                </div>
            ) : (
                <div className="glass-card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                {['Ticker', 'Name', 'Qty', 'Buy Price', 'Current', 'Market Value', 'P&L', 'Weight', ''].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-medium"
                                        style={{ color: 'var(--color-text-muted)' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {holdings.map((h, i) => (
                                <tr key={h.holdingId || i}
                                    style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-teal-400)' }}>
                                        {h.ticker}
                                    </td>
                                    <td className="px-4 py-3" style={{ color: 'var(--color-text-secondary)' }}>
                                        {h.assetName || '—'}
                                    </td>
                                    <td className="px-4 py-3" style={{ color: 'var(--color-text-primary)' }}>
                                        {h.quantity}
                                    </td>
                                    <td className="px-4 py-3" style={{ color: 'var(--color-text-primary)' }}>
                                        ${(h.buyPrice || 0).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3" style={{ color: 'var(--color-text-primary)' }}>
                                        ${(h.currentPrice || h.buyPrice || 0).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-text-primary)' }}>
                                        ${(h.marketValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 py-3 font-medium"
                                        style={{ color: (h.pnl || 0) >= 0 ? 'var(--color-green-400)' : 'var(--color-red-500)' }}>
                                        ${(h.pnl || 0).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>
                                        {(h.weightPct || 0).toFixed(1)}%
                                    </td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => handleRemoveHolding(h.holdingId)}
                                            className="text-xs px-2 py-1 rounded cursor-pointer"
                                            style={{ color: 'var(--color-red-500)', background: 'rgba(239,68,68,0.1)' }}>
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
