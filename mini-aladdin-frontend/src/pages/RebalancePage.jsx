import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

export default function RebalancePage() {
    const [portfolios, setPortfolios] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [analyzed, setAnalyzed] = useState(false);

    useEffect(() => {
        axiosClient.get('/portfolios').then(res => {
            if (res.data?.success) setPortfolios(res.data.data || []);
        }).catch(() => { });
    }, []);

    const analyzeRebalance = async () => {
        if (!selectedId) return;
        setLoading(true);
        setAnalyzed(false);
        try {
            const res = await axiosClient.get(`/rebalance/portfolio/${selectedId}`);
            if (res.data?.success) setRecommendations(res.data.data || []);
            setAnalyzed(true);
        } catch (err) {
            alert('Failed to analyze. Make sure your portfolio has holdings.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                Rebalance ⚖️
            </h1>
            <p className="mb-8" style={{ color: 'var(--color-text-muted)' }}>
                Detect allocation drift and get buy/sell recommendations
            </p>

            {/* Portfolio selector */}
            <div className="glass-card p-6 mb-8">
                <div className="flex items-end gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                            Select Portfolio
                        </label>
                        <select value={selectedId} onChange={e => { setSelectedId(e.target.value); setRecommendations([]); setAnalyzed(false); }}
                            className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                            style={{ background: 'var(--color-navy-800)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }}>
                            <option value="">Choose a portfolio...</option>
                            {portfolios.map(p => (
                                <option key={p.id} value={p.id}>{p.name} ({(p.holdings || []).length} holdings)</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={analyzeRebalance} disabled={!selectedId || loading}
                        className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200"
                        style={{ background: selectedId ? 'var(--color-teal-500)' : 'var(--color-navy-600)', color: 'var(--color-navy-950)' }}>
                        {loading ? 'Analyzing...' : 'Analyze Drift'}
                    </button>
                </div>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="glass-card p-6 animate-pulse">
                    <div className="h-5 w-48 rounded mb-4" style={{ background: 'var(--color-navy-700)' }} />
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-12 rounded mb-3" style={{ background: 'var(--color-navy-700)' }} />
                    ))}
                </div>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && !loading && (
                <div className="glass-card overflow-hidden">
                    <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
                        <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                            Recommendations ({recommendations.length})
                        </h3>
                        <div className="flex gap-2">
                            <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(52,211,153,0.15)', color: 'var(--color-green-400)' }}>
                                {recommendations.filter(r => r.action === 'BUY').length} BUY
                            </span>
                            <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--color-red-500)' }}>
                                {recommendations.filter(r => r.action === 'SELL').length} SELL
                            </span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    {['Asset', 'Action', 'Current %', 'Target %', 'Drift', 'Est. Value', 'Reason'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-medium"
                                            style={{ color: 'var(--color-text-muted)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {recommendations.map((rec, i) => (
                                    <tr key={i}
                                        className="transition-colors duration-150"
                                        style={{ borderBottom: '1px solid var(--color-border)' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(20, 184, 166, 0.03)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-teal-400)' }}>
                                            {rec.ticker}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 rounded text-xs font-semibold"
                                                style={{
                                                    background: rec.action === 'BUY' ? 'rgba(52,211,153,0.15)' : 'rgba(239,68,68,0.15)',
                                                    color: rec.action === 'BUY' ? 'var(--color-green-400)' : 'var(--color-red-500)',
                                                }}>
                                                {rec.action}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3" style={{ color: 'var(--color-text-primary)' }}>
                                            {Number(rec.currentPct).toFixed(1)}%
                                        </td>
                                        <td className="px-4 py-3" style={{ color: 'var(--color-text-primary)' }}>
                                            {Number(rec.targetPct).toFixed(1)}%
                                        </td>
                                        <td className="px-4 py-3 font-medium"
                                            style={{ color: Number(rec.driftPct) > 0 ? 'var(--color-amber-400)' : 'var(--color-teal-400)' }}>
                                            {Number(rec.driftPct) > 0 ? '+' : ''}{Number(rec.driftPct).toFixed(1)}%
                                        </td>
                                        <td className="px-4 py-3" style={{ color: 'var(--color-text-primary)' }}>
                                            ${Number(rec.estimatedValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-text-muted)', maxWidth: '250px' }}>
                                            {rec.reason}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* No drift detected */}
            {analyzed && recommendations.length === 0 && !loading && (
                <div className="glass-card p-12 text-center">
                    <p className="text-4xl mb-4">✅</p>
                    <p className="text-lg font-semibold mb-2" style={{ color: 'var(--color-green-400)' }}>Portfolio is balanced</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        Your portfolio allocation is within the ±2% drift threshold. No rebalancing needed.
                    </p>
                </div>
            )}
        </div>
    );
}
