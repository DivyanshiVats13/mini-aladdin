import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const C = { primary: '#059669', primaryDk: '#047857', txt: '#111827', sub: '#4B5563', muted: '#6B7280', border: '#E5E7EB', bg2: '#F3F4F6', green: '#16A34A', red: '#DC2626', amber: '#D97706' };

export default function RiskDashboardPage() {
    const [portfolios, setPortfolios] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [riskReport, setRiskReport] = useState(null);
    const [sectors, setSectors] = useState({});
    const [loading, setLoading] = useState(false);
    const [analyzed, setAnalyzed] = useState(false);

    useEffect(() => {
        axiosClient.get('/portfolios').then(res => { if (res.data?.success) setPortfolios(res.data.data || []); }).catch(() => {});
    }, []);

    const analyzeRisk = async () => {
        if (!selectedId) return;
        setLoading(true); setAnalyzed(false);
        try {
            const [riskRes, sectorRes] = await Promise.all([
                axiosClient.get(`/risk/portfolio/${selectedId}`),
                axiosClient.get(`/risk/sector/${selectedId}`),
            ]);
            if (riskRes.data?.success) setRiskReport(riskRes.data.data);
            if (sectorRes.data?.success) setSectors(sectorRes.data.data || {});
            setAnalyzed(true);
        } catch { alert('Failed to analyze risk. Make sure your portfolio has holdings.'); }
        finally { setLoading(false); }
    };

    const barColors = [C.primary, C.green, C.amber, '#6366F1', '#EC4899', '#8B5CF6'];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: C.txt }}>Risk Analytics ⚡</h1>
            <p className="mb-8" style={{ color: C.muted }}>Analyze portfolio risk metrics and sector concentration</p>

            <div className="card p-6 mb-8">
                <div className="flex items-end gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-2" style={{ color: C.sub }}>Select Portfolio</label>
                        <select value={selectedId} onChange={e => { setSelectedId(e.target.value); setRiskReport(null); setSectors({}); setAnalyzed(false); }}
                            className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                            style={{ background: '#fff', color: C.txt, border: `1px solid ${C.border}` }}>
                            <option value="">Choose a portfolio...</option>
                            {portfolios.map(p => <option key={p.id} value={p.id}>{p.name} ({(p.holdings || []).length} holdings)</option>)}
                        </select>
                    </div>
                    <button onClick={analyzeRisk} disabled={!selectedId || loading}
                        className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer text-white"
                        style={{ background: selectedId ? C.primary : '#9CA3AF' }}>{loading ? 'Analyzing...' : 'Analyze Risk'}</button>
                </div>
            </div>

            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[1,2,3,4].map(i => <div key={i} className="card p-5 animate-pulse"><div className="h-3 w-20 rounded mb-3" style={{ background: C.bg2 }} /><div className="h-7 w-24 rounded" style={{ background: C.bg2 }} /></div>)}
                </div>
            )}

            {riskReport && !loading && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <MC label="Portfolio Beta" value={Number(riskReport.beta).toFixed(4)}
                            subtitle={Number(riskReport.beta) > 1 ? 'Higher than market' : 'Lower than market'} color={C.primary} />
                        <MC label="Volatility" value={`${(Number(riskReport.volatility)*100).toFixed(2)}%`} subtitle="Annualized" color={C.amber} />
                        <MC label="Sharpe Ratio" value={Number(riskReport.sharpeRatio).toFixed(4)}
                            subtitle={Number(riskReport.sharpeRatio) > 1 ? 'Good risk-adjusted return' : 'Risk-adjusted return'} color={C.green} />
                        <MC label="Daily VaR (95%)" value={`$${Number(riskReport.varDaily95 || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                            subtitle="Max expected daily loss" color={C.red} />
                    </div>

                    <div className="card p-6 mb-8">
                        <h3 className="text-sm font-semibold mb-3" style={{ color: C.txt }}>📖 What do these metrics mean?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs" style={{ color: C.muted }}>
                            <p><strong style={{ color: C.primary }}>Beta:</strong> Measures portfolio sensitivity to market movements. Beta &gt; 1 means more volatile than S&P 500.</p>
                            <p><strong style={{ color: C.amber }}>Volatility:</strong> Annualized standard deviation of returns. Higher = more price swings.</p>
                            <p><strong style={{ color: C.green }}>Sharpe Ratio:</strong> Return per unit of risk. Above 1.0 is considered good.</p>
                            <p><strong style={{ color: C.red }}>VaR (95%):</strong> Maximum expected loss in a single day with 95% confidence.</p>
                        </div>
                    </div>

                    {Object.keys(sectors).length > 0 && (
                        <div className="card p-6">
                            <h3 className="text-lg font-semibold mb-4" style={{ color: C.txt }}>🏢 Sector Concentration</h3>
                            <div className="space-y-3">
                                {Object.entries(sectors).map(([sector, pct], i) => (
                                    <div key={sector}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span style={{ color: C.sub }}>{sector}</span>
                                            <span className="font-medium" style={{ color: C.txt }}>{pct}%</span>
                                        </div>
                                        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: C.bg2 }}>
                                            <div className="h-full rounded-full transition-all duration-700"
                                                style={{ width: `${Math.min(pct, 100)}%`, background: barColors[i % barColors.length] }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {Object.values(sectors).some(v => Number(v) > 40) && (
                                <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: '#FFFBEB', color: C.amber, border: '1px solid #FDE68A' }}>
                                    ⚠️ High sector concentration detected. Consider diversifying.
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {analyzed && !riskReport && !loading && (
                <div className="card p-12 text-center">
                    <p className="text-4xl mb-4">📊</p>
                    <p style={{ color: C.sub }}>No risk data available</p>
                    <p className="text-sm mt-1" style={{ color: C.muted }}>Make sure your portfolio has holdings.</p>
                </div>
            )}
        </div>
    );
}

function MC({ label, value, subtitle, color }) {
    return (
        <div className="card p-5 transition-all hover:shadow-md">
            <p className="text-xs font-medium mb-1" style={{ color: '#6B7280' }}>{label}</p>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
            {subtitle && <p className="text-xs mt-1" style={{ color: '#6B7280' }}>{subtitle}</p>}
        </div>
    );
}
