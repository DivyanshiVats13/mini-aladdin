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
        try {
            const res = await axiosClient.post(`/stress-test/run/${selectedId}`);
            if (res.data?.success) setResults(res.data.data || []);
        } catch (err) {
            alert('Failed to run stress tests. Make sure the stress-test-service is running.');
        } finally {
            setLoading(false);
        }
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
                        <select value={selectedId} onChange={e => setSelectedId(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                            style={{ background: 'var(--color-navy-800)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }}>
                            <option value="">Choose a portfolio...</option>
                            {portfolios.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={runStressTests} disabled={!selectedId || loading}
                        className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer"
                        style={{ background: selectedId ? 'var(--color-teal-500)' : 'var(--color-navy-600)', color: 'var(--color-navy-950)' }}>
                        {loading ? 'Running...' : 'Run All Scenarios'}
                    </button>
                </div>
            </div>

            {/* Available scenarios */}
            {scenarios.length > 0 && results.length === 0 && (
                <div className="glass-card p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                        Available Scenarios ({scenarios.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {scenarios.map(s => (
                            <div key={s.id} className="p-4 rounded-lg" style={{ background: 'var(--color-navy-800)', border: '1px solid var(--color-border)' }}>
                                <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-text-primary)' }}>
                                    {s.name}
                                </h4>
                                <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
                                    {s.description}
                                </p>
                                <p className="text-xs font-medium" style={{ color: 'var(--color-red-500)' }}>
                                    Equity: {s.equityShockPct}% | Bond: {s.bondShockPct}%
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Results */}
            {results.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                        Stress Test Results
                    </h3>
                    {results.map((r, i) => {
                        const impactPct = r.impactPct || 0;
                        const barWidth = Math.min(Math.abs(impactPct), 100);
                        return (
                            <div key={r.id || i} className="glass-card p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                        {r.scenarioName}
                                    </h4>
                                    <span className="text-lg font-bold"
                                        style={{ color: impactPct >= 0 ? 'var(--color-green-400)' : 'var(--color-red-500)' }}>
                                        {impactPct >= 0 ? '+' : ''}{impactPct.toFixed(2)}%
                                    </span>
                                </div>

                                {/* Impact bar */}
                                <div className="h-3 rounded-full overflow-hidden mb-3" style={{ background: 'var(--color-navy-700)' }}>
                                    <div className="h-full rounded-full transition-all duration-700"
                                        style={{
                                            width: `${barWidth}%`,
                                            background: impactPct >= 0 ? 'var(--color-green-400)' : 'var(--color-red-500)',
                                        }} />
                                </div>

                                <div className="flex justify-between text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                    <span>Original: ${(r.originalValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                    <span>Stressed: ${(r.stressedValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                    <span>Impact: ${(r.impactAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
