import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

export default function RiskDashboardPage() {
    const [portfolios, setPortfolios] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [riskReport, setRiskReport] = useState(null);
    const [sectors, setSectors] = useState({});
    const [loading, setLoading] = useState(false);
    const [analyzed, setAnalyzed] = useState(false);

    useEffect(() => {
        axiosClient.get('/portfolios').then(res => {
            if (res.data?.success) setPortfolios(res.data.data || []);
        }).catch(() => { });
    }, []);

    const analyzeRisk = async () => {
        if (!selectedId) return;
        setLoading(true);
        setAnalyzed(false);
        try {
            const [riskRes, sectorRes] = await Promise.all([
                axiosClient.get(`/risk/portfolio/${selectedId}`),
                axiosClient.get(`/risk/sector/${selectedId}`),
            ]);
            if (riskRes.data?.success) setRiskReport(riskRes.data.data);
            if (sectorRes.data?.success) setSectors(sectorRes.data.data || {});
            setAnalyzed(true);
        } catch (err) {
            alert('Failed to analyze risk. Make sure your portfolio has holdings.');
        } finally {
            setLoading(false);
        }
    };

    const sectorColors = [
        'var(--color-teal-400)',
        'var(--color-green-400)',
        'var(--color-amber-400)',
        'var(--color-teal-300)',
        'var(--color-green-300)',
        'var(--color-amber-300)',
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                Risk Analytics ⚡
            </h1>
            <p className="mb-8" style={{ color: 'var(--color-text-muted)' }}>
                Analyze portfolio risk metrics and sector concentration
            </p>

            {/* Portfolio selector */}
            <div className="glass-card p-6 mb-8">
                <div className="flex items-end gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                            Select Portfolio
                        </label>
                        <select value={selectedId} onChange={e => { setSelectedId(e.target.value); setRiskReport(null); setSectors({}); setAnalyzed(false); }}
                            className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                            style={{ background: 'var(--color-navy-800)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }}>
                            <option value="">Choose a portfolio...</option>
                            {portfolios.map(p => (
                                <option key={p.id} value={p.id}>{p.name} ({(p.holdings || []).length} holdings)</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={analyzeRisk} disabled={!selectedId || loading}
                        className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200"
                        style={{ background: selectedId ? 'var(--color-teal-500)' : 'var(--color-navy-600)', color: 'var(--color-navy-950)' }}>
                        {loading ? 'Analyzing...' : 'Analyze Risk'}
                    </button>
                </div>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="glass-card p-5 animate-pulse">
                            <div className="h-3 w-20 rounded mb-3" style={{ background: 'var(--color-navy-700)' }} />
                            <div className="h-7 w-24 rounded mb-2" style={{ background: 'var(--color-navy-700)' }} />
                            <div className="h-3 w-28 rounded" style={{ background: 'var(--color-navy-700)' }} />
                        </div>
                    ))}
                </div>
            )}

            {/* Risk metrics */}
            {riskReport && !loading && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <MetricCard label="Portfolio Beta" value={Number(riskReport.beta).toFixed(4)}
                            subtitle={Number(riskReport.beta) > 1 ? 'Higher than market' : Number(riskReport.beta) < 1 ? 'Lower than market' : 'Market-like'}
                            color="var(--color-teal-400)" />
                        <MetricCard label="Volatility" value={`${(Number(riskReport.volatility) * 100).toFixed(2)}%`}
                            subtitle="Annualized" color="var(--color-amber-400)" />
                        <MetricCard label="Sharpe Ratio" value={Number(riskReport.sharpeRatio).toFixed(4)}
                            subtitle={Number(riskReport.sharpeRatio) > 1 ? 'Good risk-adjusted return' : 'Risk-adjusted return'}
                            color="var(--color-green-400)" />
                        <MetricCard label="Daily VaR (95%)"
                            value={`$${Number(riskReport.varDaily95 || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                            subtitle="Max expected daily loss" color="var(--color-red-500)" />
                    </div>

                    {/* Metric explanations */}
                    <div className="glass-card p-6 mb-8">
                        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                            📖 What do these metrics mean?
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            <p><strong style={{ color: 'var(--color-teal-400)' }}>Beta:</strong> Measures portfolio sensitivity to market movements. Beta &gt; 1 means more volatile than S&P 500.</p>
                            <p><strong style={{ color: 'var(--color-amber-400)' }}>Volatility:</strong> Annualized standard deviation of returns. Higher = more price swings.</p>
                            <p><strong style={{ color: 'var(--color-green-400)' }}>Sharpe Ratio:</strong> Return per unit of risk. Higher is better. Above 1.0 is considered good.</p>
                            <p><strong style={{ color: 'var(--color-red-500)' }}>VaR (95%):</strong> Maximum expected loss in a single day with 95% confidence.</p>
                        </div>
                    </div>

                    {/* Sector concentration */}
                    {Object.keys(sectors).length > 0 && (
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                                🏢 Sector Concentration
                            </h3>
                            <div className="space-y-3">
                                {Object.entries(sectors).map(([sector, pct], i) => (
                                    <div key={sector}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span style={{ color: 'var(--color-text-secondary)' }}>{sector}</span>
                                            <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{pct}%</span>
                                        </div>
                                        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--color-navy-700)' }}>
                                            <div className="h-full rounded-full transition-all duration-700"
                                                style={{
                                                    width: `${Math.min(pct, 100)}%`,
                                                    background: sectorColors[i % sectorColors.length],
                                                }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {Object.values(sectors).some(v => Number(v) > 40) && (
                                <div className="mt-4 p-3 rounded-lg text-xs"
                                    style={{ background: 'rgba(251, 191, 36, 0.1)', color: 'var(--color-amber-400)', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                                    ⚠️ High sector concentration detected. Consider diversifying to reduce sector-specific risk.
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Empty state after analysis */}
            {analyzed && !riskReport && !loading && (
                <div className="glass-card p-12 text-center">
                    <p className="text-4xl mb-4">📊</p>
                    <p style={{ color: 'var(--color-text-secondary)' }}>No risk data available</p>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                        Make sure your portfolio has holdings to analyze.
                    </p>
                </div>
            )}
        </div>
    );
}

function MetricCard({ label, value, subtitle, color }) {
    return (
        <div className="glass-card p-5 transition-all duration-300 hover:scale-[1.02]">
            <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
            {subtitle && <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{subtitle}</p>}
        </div>
    );
}
