import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

export default function RebalancePage() {
    const [portfolios, setPortfolios] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axiosClient.get('/portfolios').then(res => {
            if (res.data?.success) setPortfolios(res.data.data || []);
        }).catch(() => { });
    }, []);

    const analyzeRebalance = async () => {
        if (!selectedId) return;
        setLoading(true);
        try {
            const res = await axiosClient.get(`/rebalance/portfolio/${selectedId}`);
            if (res.data?.success) setRecommendations(res.data.data || []);
        } catch (err) {
            alert('Failed to analyze. Make sure the rebalance-engine is running.');
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
                        <select value={selectedId} onChange={e => setSelectedId(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                            style={{ background: 'var(--color-navy-800)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }}>
                            <option value="">Choose a portfolio...</option>
                            {portfolios.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={analyzeRebalance} disabled={!selectedId || loading}
                        className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer"
                        style={{ background: selectedId ? 'var(--color-teal-500)' : 'var(--color-navy-600)', color: 'var(--color-navy-950)' }}>
                        {loading ? 'Analyzing...' : 'Analyze Drift'}
                    </button>
                </div>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <div className="glass-card overflow-hidden">
                    <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                        <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                            Recommendations ({recommendations.length})
                        </h3>
                    </div>
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
                                <tr key={rec.id || i} style={{ borderBottom: '1px solid var(--color-border)' }}>
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
                                        {rec.currentPct?.toFixed(1)}%
                                    </td>
                                    <td className="px-4 py-3" style={{ color: 'var(--color-text-primary)' }}>
                                        {rec.targetPct?.toFixed(1)}%
                                    </td>
                                    <td className="px-4 py-3 font-medium"
                                        style={{ color: (rec.driftPct || 0) > 0 ? 'var(--color-amber-400)' : 'var(--color-teal-400)' }}>
                                        {rec.driftPct > 0 ? '+' : ''}{rec.driftPct?.toFixed(1)}%
                                    </td>
                                    <td className="px-4 py-3" style={{ color: 'var(--color-text-primary)' }}>
                                        ${(rec.estimatedValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-text-muted)', maxWidth: '250px' }}>
                                        {rec.reason}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {recommendations.length === 0 && selectedId && !loading && (
                <div className="glass-card p-12 text-center">
                    <p style={{ color: 'var(--color-text-secondary)' }}>No drift detected</p>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                        Your portfolio allocation is within the threshold. No rebalancing needed.
                    </p>
                </div>
            )}
        </div>
    );
}
