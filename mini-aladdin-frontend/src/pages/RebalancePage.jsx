import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const C = { primary: '#059669', txt: '#111827', sub: '#4B5563', muted: '#6B7280', border: '#E5E7EB', bg2: '#F3F4F6', green: '#16A34A', red: '#DC2626', amber: '#D97706' };

export default function RebalancePage() {
    const [portfolios, setPortfolios] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [analyzed, setAnalyzed] = useState(false);

    useEffect(() => {
        axiosClient.get('/portfolios').then(res => { if (res.data?.success) setPortfolios(res.data.data || []); }).catch(() => {});
    }, []);

    const analyzeRebalance = async () => {
        if (!selectedId) return;
        setLoading(true); setAnalyzed(false);
        try { const res = await axiosClient.get(`/rebalance/portfolio/${selectedId}`); if (res.data?.success) setRecommendations(res.data.data || []); setAnalyzed(true); }
        catch { alert('Failed to analyze. Make sure your portfolio has holdings.'); }
        finally { setLoading(false); }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: C.txt }}>Rebalance ⚖️</h1>
            <p className="mb-8" style={{ color: C.muted }}>Detect allocation drift and get buy/sell recommendations</p>

            <div className="card p-6 mb-8">
                <div className="flex items-end gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-2" style={{ color: C.sub }}>Select Portfolio</label>
                        <select value={selectedId} onChange={e => { setSelectedId(e.target.value); setRecommendations([]); setAnalyzed(false); }}
                            className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                            style={{ background: '#fff', color: C.txt, border: `1px solid ${C.border}` }}>
                            <option value="">Choose a portfolio...</option>
                            {portfolios.map(p => <option key={p.id} value={p.id}>{p.name} ({(p.holdings || []).length} holdings)</option>)}
                        </select>
                    </div>
                    <button onClick={analyzeRebalance} disabled={!selectedId || loading}
                        className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer text-white"
                        style={{ background: selectedId ? C.primary : '#9CA3AF' }}>{loading ? 'Analyzing...' : 'Analyze Drift'}</button>
                </div>
            </div>

            {loading && (
                <div className="card p-6 animate-pulse">
                    <div className="h-5 w-48 rounded mb-4" style={{ background: C.bg2 }} />
                    {[1,2,3].map(i => <div key={i} className="h-12 rounded mb-3" style={{ background: C.bg2 }} />)}
                </div>
            )}

            {recommendations.length > 0 && !loading && (
                <div className="card overflow-hidden">
                    <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: C.border }}>
                        <h3 className="text-lg font-semibold" style={{ color: C.txt }}>Recommendations ({recommendations.length})</h3>
                        <div className="flex gap-2">
                            <span className="text-xs px-2 py-1 rounded" style={{ background: '#ECFDF5', color: C.green }}>
                                {recommendations.filter(r => r.action === 'BUY').length} BUY
                            </span>
                            <span className="text-xs px-2 py-1 rounded" style={{ background: '#FEF2F2', color: C.red }}>
                                {recommendations.filter(r => r.action === 'SELL').length} SELL
                            </span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: `1px solid ${C.border}`, background: '#F9FAFB' }}>
                                    {['Asset', 'Action', 'Current %', 'Target %', 'Drift', 'Est. Value', 'Reason'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-medium" style={{ color: C.muted }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {recommendations.map((rec, i) => (
                                    <tr key={i} className="transition-colors hover:bg-gray-50" style={{ borderBottom: `1px solid ${C.border}` }}>
                                        <td className="px-4 py-3 font-medium" style={{ color: C.primary }}>{rec.ticker}</td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 rounded text-xs font-semibold"
                                                style={{ background: rec.action === 'BUY' ? '#ECFDF5' : '#FEF2F2', color: rec.action === 'BUY' ? C.green : C.red }}>{rec.action}</span>
                                        </td>
                                        <td className="px-4 py-3" style={{ color: C.txt }}>{Number(rec.currentPct).toFixed(1)}%</td>
                                        <td className="px-4 py-3" style={{ color: C.txt }}>{Number(rec.targetPct).toFixed(1)}%</td>
                                        <td className="px-4 py-3 font-medium" style={{ color: Number(rec.driftPct) > 0 ? C.amber : C.primary }}>
                                            {Number(rec.driftPct) > 0 ? '+' : ''}{Number(rec.driftPct).toFixed(1)}%
                                        </td>
                                        <td className="px-4 py-3" style={{ color: C.txt }}>${Number(rec.estimatedValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                        <td className="px-4 py-3 text-xs" style={{ color: C.muted, maxWidth: '250px' }}>{rec.reason}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {analyzed && recommendations.length === 0 && !loading && (
                <div className="card p-12 text-center">
                    <p className="text-4xl mb-4">✅</p>
                    <p className="text-lg font-semibold mb-2" style={{ color: C.green }}>Portfolio is balanced</p>
                    <p className="text-sm" style={{ color: C.muted }}>No rebalancing needed. Allocation is within ±2% threshold.</p>
                </div>
            )}
        </div>
    );
}
