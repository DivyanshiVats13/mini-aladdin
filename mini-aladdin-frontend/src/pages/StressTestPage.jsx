import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

export default function StressTestPage() {
    const [portfolios, setPortfolios] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [scenarios, setScenarios] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axiosClient.get('/portfolios').then(res => {
            if (res.data?.success) setPortfolios(res.data.data || []);
        }).catch(() => { });

        axiosClient.get('/stress-test/scenarios').then(res => {
            if (res.data?.success) setScenarios(res.data.data || []);
        }).catch(() => { });
    }, []);

    const runStressTests = async () => {
        if (!selectedId) return;
        setLoading(true);
        setResults([]);
        try {
            const res = await axiosClient.post(`/stress-test/run/${selectedId}`);
            if (res.data?.success) setResults(res.data.data || []);
        } catch (err) {
            alert('Failed to run stress tests. Make sure your portfolio has holdings.');
        } finally {
            setLoading(false);
        }
    };

    // Find matching scenario description
    const getScenarioInfo = (scenarioName) => {
        return scenarios.find(s => s.name === scenarioName) || null;
    };

    const scenarioIcons = {
        '2008 Financial Crisis': '💥',
        'COVID-19 Crash': '🦠',
        'Dot-com Bust': '💻',
        'Rate Hike Shock': '📈',
        'Stagflation Scenario': '📉',
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                Stress Test 🔥
            </h1>
            <p className="mb-8" style={{ color: 'var(--color-text-muted)' }}>
                Simulate historical crashes on your portfolio
            </p>

            {/* Portfolio selector */}
            <div className="glass-card p-6 mb-8">
                <div className="flex items-end gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                            Select Portfolio
                        </label>
                        <select value={selectedId} onChange={e => { setSelectedId(e.target.value); setResults([]); }}
                            className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                            style={{ background: 'var(--color-navy-800)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }}>
                            <option value="">Choose a portfolio...</option>
                            {portfolios.map(p => (
                                <option key={p.id} value={p.id}>{p.name} ({(p.holdings || []).length} holdings)</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={runStressTests} disabled={!selectedId || loading}
                        className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200"
                        style={{ background: selectedId ? 'var(--color-teal-500)' : 'var(--color-navy-600)', color: 'var(--color-navy-950)' }}>
                        {loading ? 'Running...' : 'Run All Scenarios'}
                    </button>
                </div>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="glass-card p-5 animate-pulse">
                            <div className="flex justify-between mb-3">
                                <div className="h-5 w-40 rounded" style={{ background: 'var(--color-navy-700)' }} />
                                <div className="h-5 w-20 rounded" style={{ background: 'var(--color-navy-700)' }} />
                            </div>
                            <div className="h-3 w-full rounded mb-3" style={{ background: 'var(--color-navy-700)' }} />
                            <div className="h-3 w-3/4 rounded" style={{ background: 'var(--color-navy-700)' }} />
                        </div>
                    ))}
                </div>
            )}

            {/* Available scenarios */}
            {scenarios.length > 0 && results.length === 0 && !loading && (
                <div className="glass-card p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                        Available Scenarios ({scenarios.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {scenarios.map(s => (
                            <div key={s.id} className="p-4 rounded-lg transition-all duration-200 hover:scale-[1.02]"
                                style={{ background: 'var(--color-navy-800)', border: '1px solid var(--color-border)' }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">{scenarioIcons[s.name] || '📊'}</span>
                                    <h4 className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                                        {s.name}
                                    </h4>
                                </div>
                                <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
                                    {s.description}
                                </p>
                                <div className="flex gap-3">
                                    <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--color-red-500)' }}>
                                        Equity: {s.equityShockPct}%
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded"
                                        style={{ background: s.bondShockPct >= 0 ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)',
                                            color: s.bondShockPct >= 0 ? 'var(--color-green-400)' : 'var(--color-red-500)' }}>
                                        Bond: {s.bondShockPct > 0 ? '+' : ''}{s.bondShockPct}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Results */}
            {results.length > 0 && !loading && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                            Stress Test Results
                        </h3>
                        <button onClick={() => setResults([])}
                            className="text-xs px-3 py-1.5 rounded-lg cursor-pointer"
                            style={{ background: 'var(--color-navy-800)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
                            Show Scenarios
                        </button>
                    </div>

                    {/* Summary */}
                    <div className="glass-card p-4 mb-4">
                        <div className="flex items-center gap-4 text-sm">
                            <span style={{ color: 'var(--color-text-muted)' }}>Worst Case:</span>
                            <span className="font-bold" style={{ color: 'var(--color-red-500)' }}>
                                {Math.min(...results.map(r => Number(r.impactPct))).toFixed(2)}%
                            </span>
                            <span style={{ color: 'var(--color-text-muted)' }}>|</span>
                            <span style={{ color: 'var(--color-text-muted)' }}>Best Case:</span>
                            <span className="font-bold" style={{ color: Number(Math.max(...results.map(r => Number(r.impactPct)))) >= 0 ? 'var(--color-green-400)' : 'var(--color-red-500)' }}>
                                {Math.max(...results.map(r => Number(r.impactPct))).toFixed(2)}%
                            </span>
                        </div>
                    </div>

                    {results.map((r, i) => {
                        const impactPct = Number(r.impactPct) || 0;
                        const barWidth = Math.min(Math.abs(impactPct), 100);
                        const scenarioInfo = getScenarioInfo(r.scenarioName);
                        const icon = scenarioIcons[r.scenarioName] || '📊';
                        return (
                            <div key={i} className="glass-card p-5 transition-all duration-200 hover:scale-[1.005]">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{icon}</span>
                                        <h4 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                            {r.scenarioName}
                                        </h4>
                                    </div>
                                    <span className="text-xl font-bold"
                                        style={{ color: impactPct >= 0 ? 'var(--color-green-400)' : 'var(--color-red-500)' }}>
                                        {impactPct >= 0 ? '+' : ''}{impactPct.toFixed(2)}%
                                    </span>
                                </div>

                                {scenarioInfo && (
                                    <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
                                        {scenarioInfo.description}
                                    </p>
                                )}

                                {/* Impact bar */}
                                <div className="h-3 rounded-full overflow-hidden mb-3" style={{ background: 'var(--color-navy-700)' }}>
                                    <div className="h-full rounded-full transition-all duration-700"
                                        style={{
                                            width: `${barWidth}%`,
                                            background: impactPct >= 0 ? 'var(--color-green-400)' : 'var(--color-red-500)',
                                        }} />
                                </div>

                                <div className="flex justify-between text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                    <span>Original: ${Number(r.originalValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                    <span>Stressed: ${Number(r.stressedValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                    <span style={{ color: impactPct >= 0 ? 'var(--color-green-400)' : 'var(--color-red-500)' }}>
                                        Impact: {impactPct >= 0 ? '+' : ''}${Number(r.impactAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
