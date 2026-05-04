import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const C = { primary: '#059669', primaryDk: '#047857', txt: '#111827', sub: '#4B5563', muted: '#6B7280', border: '#E5E7EB', bg2: '#F3F4F6', green: '#16A34A', red: '#DC2626' };

export default function StressTestPage() {
    const [portfolios, setPortfolios] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [scenarios, setScenarios] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axiosClient.get('/portfolios').then(res => { if (res.data?.success) setPortfolios(res.data.data || []); }).catch(() => {});
        axiosClient.get('/stress-test/scenarios').then(res => { if (res.data?.success) setScenarios(res.data.data || []); }).catch(() => {});
    }, []);

    const runStressTests = async () => {
        if (!selectedId) return;
        setLoading(true); setResults([]);
        try { const res = await axiosClient.post(`/stress-test/run/${selectedId}`); if (res.data?.success) setResults(res.data.data || []); }
        catch { alert('Failed to run stress tests.'); }
        finally { setLoading(false); }
    };

    const getScenarioInfo = (name) => scenarios.find(s => s.name === name) || null;
    const icons = { '2008 Financial Crisis': '💥', 'COVID-19 Crash': '🦠', 'Dot-com Bust': '💻', 'Rate Hike Shock': '📈', 'Stagflation Scenario': '📉' };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: C.txt }}>Stress Test 🔥</h1>
            <p className="mb-8" style={{ color: C.muted }}>Simulate historical crashes on your portfolio</p>

            <div className="card p-6 mb-8">
                <div className="flex items-end gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-2" style={{ color: C.sub }}>Select Portfolio</label>
                        <select value={selectedId} onChange={e => { setSelectedId(e.target.value); setResults([]); }}
                            className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                            style={{ background: '#fff', color: C.txt, border: `1px solid ${C.border}` }}>
                            <option value="">Choose a portfolio...</option>
                            {portfolios.map(p => <option key={p.id} value={p.id}>{p.name} ({(p.holdings || []).length} holdings)</option>)}
                        </select>
                    </div>
                    <button onClick={runStressTests} disabled={!selectedId || loading}
                        className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer text-white"
                        style={{ background: selectedId ? C.primary : '#9CA3AF' }}>{loading ? 'Running...' : 'Run All Scenarios'}</button>
                </div>
            </div>

            {loading && (
                <div className="space-y-4">
                    {[1,2,3,4,5].map(i => (
                        <div key={i} className="card p-5 animate-pulse">
                            <div className="flex justify-between mb-3">
                                <div className="h-5 w-40 rounded" style={{ background: C.bg2 }} />
                                <div className="h-5 w-20 rounded" style={{ background: C.bg2 }} />
                            </div>
                            <div className="h-3 w-full rounded mb-3" style={{ background: C.bg2 }} />
                        </div>
                    ))}
                </div>
            )}

            {scenarios.length > 0 && results.length === 0 && !loading && (
                <div className="card p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4" style={{ color: C.txt }}>Available Scenarios ({scenarios.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {scenarios.map(s => (
                            <div key={s.id} className="p-4 rounded-lg transition-all hover:shadow-sm"
                                style={{ background: '#F9FAFB', border: `1px solid ${C.border}` }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">{icons[s.name] || '📊'}</span>
                                    <h4 className="font-semibold text-sm" style={{ color: C.txt }}>{s.name}</h4>
                                </div>
                                <p className="text-xs mb-3" style={{ color: C.muted }}>{s.description}</p>
                                <div className="flex gap-3">
                                    <span className="text-xs px-2 py-1 rounded" style={{ background: '#FEF2F2', color: C.red }}>
                                        Equity: {s.equityShockPct}%
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded"
                                        style={{ background: s.bondShockPct >= 0 ? '#ECFDF5' : '#FEF2F2', color: s.bondShockPct >= 0 ? C.green : C.red }}>
                                        Bond: {s.bondShockPct > 0 ? '+' : ''}{s.bondShockPct}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {results.length > 0 && !loading && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold" style={{ color: C.txt }}>Stress Test Results</h3>
                        <button onClick={() => setResults([])} className="text-xs px-3 py-1.5 rounded-lg cursor-pointer"
                            style={{ background: C.bg2, color: C.sub, border: `1px solid ${C.border}` }}>Show Scenarios</button>
                    </div>

                    <div className="card p-4 mb-4">
                        <div className="flex items-center gap-4 text-sm">
                            <span style={{ color: C.muted }}>Worst Case:</span>
                            <span className="font-bold" style={{ color: C.red }}>{Math.min(...results.map(r => Number(r.impactPct))).toFixed(2)}%</span>
                            <span style={{ color: C.muted }}>|</span>
                            <span style={{ color: C.muted }}>Best Case:</span>
                            <span className="font-bold" style={{ color: Number(Math.max(...results.map(r => Number(r.impactPct)))) >= 0 ? C.green : C.red }}>
                                {Math.max(...results.map(r => Number(r.impactPct))).toFixed(2)}%
                            </span>
                        </div>
                    </div>

                    {results.map((r, i) => {
                        const impact = Number(r.impactPct) || 0;
                        const barW = Math.min(Math.abs(impact), 100);
                        const info = getScenarioInfo(r.scenarioName);
                        return (
                            <div key={i} className="card p-5 transition-all hover:shadow-md">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{icons[r.scenarioName] || '📊'}</span>
                                        <h4 className="font-semibold" style={{ color: C.txt }}>{r.scenarioName}</h4>
                                    </div>
                                    <span className="text-xl font-bold" style={{ color: impact >= 0 ? C.green : C.red }}>
                                        {impact >= 0 ? '+' : ''}{impact.toFixed(2)}%
                                    </span>
                                </div>
                                {info && <p className="text-xs mb-3" style={{ color: C.muted }}>{info.description}</p>}
                                <div className="h-3 rounded-full overflow-hidden mb-3" style={{ background: C.bg2 }}>
                                    <div className="h-full rounded-full transition-all duration-700"
                                        style={{ width: `${barW}%`, background: impact >= 0 ? C.green : C.red }} />
                                </div>
                                <div className="flex justify-between text-xs" style={{ color: C.muted }}>
                                    <span>Original: ${Number(r.originalValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                    <span>Stressed: ${Number(r.stressedValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                    <span style={{ color: impact >= 0 ? C.green : C.red }}>
                                        Impact: {impact >= 0 ? '+' : ''}${Number(r.impactAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
