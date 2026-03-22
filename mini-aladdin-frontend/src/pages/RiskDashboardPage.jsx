import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

export default function RiskDashboardPage() {
    const [portfolios, setPortfolios] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [riskReport, setRiskReport] = useState(null);
    const [sectors, setSectors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axiosClient.get('/portfolios').then(res => {
            if (res.data?.success) setPortfolios(res.data.data || []);
        }).catch(() => { });
    }, []);

    const analyzeRisk = async () => {
        if (!selectedId) return;
        setLoading(true);
        try {
            const [riskRes, sectorRes] = await Promise.all([
                axiosClient.get(`/risk/portfolio/${selectedId}`),
                axiosClient.get(`/risk/sector/${selectedId}`),
            ]);
            if (riskRes.data?.success) setRiskReport(riskRes.data.data);
            if (sectorRes.data?.success) setSectors(sectorRes.data.data || {});
        } catch (err) {
            alert('Failed to analyze risk. Make sure the risk-engine is running.');
        } finally {
            setLoading(false);
        }
    };

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
                        <select value={selectedId} onChange={e => setSelectedId(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                            style={{ background: 'var(--color-navy-800)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }}>
                            <option value="">Choose a portfolio...</option>
                            {portfolios.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={analyzeRisk} disabled={!selectedId || loading}
                        className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer"
                        style={{ background: selectedId ? 'var(--color-teal-500)' : 'var(--color-navy-600)', color: 'var(--color-navy-950)' }}>
                        {loading ? 'Analyzing...' : 'Analyze Risk'}
                    </button>
                </div>
            </div>

            {/* Risk metrics */}
            {riskReport && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <MetricCard label="Portfolio Beta" value={riskReport.beta?.toFixed(4) || '—'}
                            subtitle={riskReport.beta > 1 ? 'Higher than market' : 'Lower than market'}
                            color="var(--color-teal-400)" />
                        <MetricCard label="Volatility" value={`${((riskReport.volatility || 0) * 100).toFixed(2)}%`}
                            subtitle="Annualized" color="var(--color-amber-400)" />
                        <MetricCard label="Sharpe Ratio" value={riskReport.sharpeRatio?.toFixed(4) || '—'}
                            subtitle="Risk-adjusted return" color="var(--color-green-400)" />
                        <MetricCard label="Daily VaR (95%)"
                            value={`$${(riskReport.varDaily95 || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                            subtitle="Max expected daily loss" color="var(--color-red-500)" />
                    </div>

                    {/* Sector concentration */}
                    {Object.keys(sectors).length > 0 && (
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                                Sector Concentration
                            </h3>
                            <div className="space-y-3">
                                {Object.entries(sectors).map(([sector, pct]) => (
                                    <div key={sector}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span style={{ color: 'var(--color-text-secondary)' }}>{sector}</span>
                                            <span style={{ color: 'var(--color-text-primary)' }}>{pct}%</span>
                                        </div>
                                        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-navy-700)' }}>
                                            <div className="h-full rounded-full transition-all duration-500"
                                                style={{ width: `${Math.min(pct, 100)}%`, background: 'var(--color-teal-400)' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function MetricCard({ label, value, subtitle, color }) {
    return (
        <div className="glass-card p-5">
            <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
            {subtitle && <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{subtitle}</p>}
        </div>
    );
}
