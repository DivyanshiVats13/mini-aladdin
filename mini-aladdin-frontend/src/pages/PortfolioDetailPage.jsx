import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import AddHoldingModal from '../components/AddHoldingModal';

const C = { primary: '#059669', primaryDk: '#047857', txt: '#111827', sub: '#4B5563', muted: '#6B7280', border: '#E5E7EB', bg2: '#F3F4F6', green: '#16A34A', red: '#DC2626' };

export default function PortfolioDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddHolding, setShowAddHolding] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const fetchPortfolio = async () => {
        try { const res = await axiosClient.get(`/portfolios/${id}`); if (res.data?.success) setPortfolio(res.data.data); }
        catch { } finally { setLoading(false); }
    };
    useEffect(() => { fetchPortfolio(); }, [id]);

    const handleRemoveHolding = async (holdingId) => {
        if (!confirm('Remove this holding?')) return;
        try { await axiosClient.delete(`/portfolios/${id}/holdings/${holdingId}`); fetchPortfolio(); } catch { alert('Failed to remove'); }
    };

    const handleDeletePortfolio = async () => {
        if (!confirm(`Delete "${portfolio.name}"? This cannot be undone.`)) return;
        setDeleting(true);
        try { await axiosClient.delete(`/portfolios/${id}`); navigate('/portfolios'); }
        catch (err) { alert(err.response?.data?.message || 'Failed'); setDeleting(false); }
    };

    if (loading) return (
        <div>
            <div className="mb-8">
                <div className="h-3 w-24 rounded mb-3 animate-pulse" style={{ background: C.bg2 }} />
                <div className="h-8 w-48 rounded mb-2 animate-pulse" style={{ background: C.bg2 }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                {[1,2,3,4,5].map(i => <div key={i} className="card p-5 animate-pulse"><div className="h-3 w-20 rounded mb-3" style={{ background: C.bg2 }} /><div className="h-7 w-28 rounded" style={{ background: C.bg2 }} /></div>)}
            </div>
        </div>
    );

    if (!portfolio) return (
        <div className="text-center py-12">
            <p className="text-4xl mb-4">🔍</p>
            <p style={{ color: C.sub }}>Portfolio not found</p>
            <Link to="/portfolios" className="text-sm mt-4 inline-block font-medium" style={{ color: C.primary }}>← Back to portfolios</Link>
        </div>
    );

    const holdings = portfolio.holdings || [];
    const totalPnLPct = portfolio.totalPnLPct || 0;

    return (
        <div>
            <div className="flex items-start justify-between mb-8">
                <div>
                    <Link to="/portfolios" className="text-xs mb-2 inline-block font-medium" style={{ color: C.primary }}>← Back to Portfolios</Link>
                    <h1 className="text-2xl font-bold" style={{ color: C.txt }}>{portfolio.name}</h1>
                    <p className="mt-1" style={{ color: C.muted }}>{portfolio.currency || 'USD'} · Created {new Date(portfolio.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setShowAddHolding(true)} className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer text-white" style={{ background: C.primary }}>+ Add Holding</button>
                    <button onClick={handleDeletePortfolio} disabled={deleting} className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
                        style={{ background: '#FEF2F2', color: C.red, border: '1px solid #FECACA' }}>{deleting ? 'Deleting...' : 'Delete'}</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <div className="card p-5"><p className="text-xs" style={{ color: C.muted }}>Total Value</p><p className="text-2xl font-bold" style={{ color: C.primaryDk }}>${Number(portfolio.totalValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p></div>
                <div className="card p-5"><p className="text-xs" style={{ color: C.muted }}>Cost Basis</p><p className="text-2xl font-bold" style={{ color: C.txt }}>${Number(portfolio.totalCostBasis || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p></div>
                <div className="card p-5"><p className="text-xs" style={{ color: C.muted }}>Total P&L</p><p className="text-2xl font-bold" style={{ color: (portfolio.totalPnL || 0) >= 0 ? C.green : C.red }}>{(portfolio.totalPnL || 0) >= 0 ? '+' : ''}${Number(Math.abs(portfolio.totalPnL || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p></div>
                <div className="card p-5"><p className="text-xs" style={{ color: C.muted }}>Return %</p><p className="text-2xl font-bold" style={{ color: totalPnLPct >= 0 ? C.green : C.red }}>{totalPnLPct >= 0 ? '+' : ''}{Number(totalPnLPct).toFixed(2)}%</p></div>
                <div className="card p-5"><p className="text-xs" style={{ color: C.muted }}>Holdings</p><p className="text-2xl font-bold" style={{ color: C.txt }}>{holdings.length}</p></div>
            </div>

            {holdings.length === 0 ? (
                <div className="card p-12 text-center">
                    <p className="text-4xl mb-4">📈</p>
                    <p style={{ color: C.sub }}>No holdings yet</p>
                    <p className="text-sm mt-1 mb-6" style={{ color: C.muted }}>Click "Add Holding" to add assets.</p>
                    <button onClick={() => setShowAddHolding(true)} className="px-6 py-2 rounded-lg text-sm font-semibold cursor-pointer text-white" style={{ background: C.primary }}>+ Add Your First Holding</button>
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="p-4 border-b" style={{ borderColor: C.border }}><h3 className="text-base font-semibold" style={{ color: C.txt }}>Holdings ({holdings.length})</h3></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: `1px solid ${C.border}`, background: '#F9FAFB' }}>
                                    {['Ticker', 'Name', 'Qty', 'Avg Cost', 'Current', 'Market Value', 'P&L', 'P&L %', 'Weight', ''].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-medium" style={{ color: C.muted }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {holdings.map((h, i) => (
                                    <tr key={h.holdingId || i} className="transition-colors hover:bg-gray-50" style={{ borderBottom: `1px solid ${C.border}` }}>
                                        <td className="px-4 py-3 font-semibold" style={{ color: C.primaryDk }}>{h.ticker}</td>
                                        <td className="px-4 py-3" style={{ color: C.sub }}>{h.assetName || '—'}</td>
                                        <td className="px-4 py-3" style={{ color: C.txt }}>{Number(h.quantity).toLocaleString('en-US')}</td>
                                        <td className="px-4 py-3" style={{ color: C.txt }}>${Number(h.avgBuyPrice || 0).toFixed(2)}</td>
                                        <td className="px-4 py-3" style={{ color: C.txt }}>${Number(h.currentPrice || h.avgBuyPrice || 0).toFixed(2)}</td>
                                        <td className="px-4 py-3 font-medium" style={{ color: C.txt }}>${Number(h.marketValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                        <td className="px-4 py-3 font-medium" style={{ color: (h.pnL || 0) >= 0 ? C.green : C.red }}>{(h.pnL || 0) >= 0 ? '+' : ''}${Number(Math.abs(h.pnL || 0)).toFixed(2)}</td>
                                        <td className="px-4 py-3 font-medium" style={{ color: (h.pnLPct || 0) >= 0 ? C.green : C.red }}>{(h.pnLPct || 0) >= 0 ? '+' : ''}{Number(h.pnLPct || 0).toFixed(2)}%</td>
                                        <td className="px-4 py-3" style={{ color: C.muted }}>{Number(h.weightPct || 0).toFixed(1)}%</td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => handleRemoveHolding(h.holdingId)} className="text-xs px-2 py-1 rounded cursor-pointer"
                                                style={{ color: C.red, background: '#FEF2F2' }}>Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {holdings.length > 0 && (
                <div className="flex gap-3 mt-6">
                    <Link to="/risk" className="card px-4 py-3 text-sm font-medium transition-all hover:shadow-md" style={{ color: C.sub }}>⚡ Risk Analysis</Link>
                    <Link to="/rebalance" className="card px-4 py-3 text-sm font-medium transition-all hover:shadow-md" style={{ color: C.sub }}>⚖️ Rebalance</Link>
                    <Link to="/stress-test" className="card px-4 py-3 text-sm font-medium transition-all hover:shadow-md" style={{ color: C.sub }}>🔥 Stress Test</Link>
                </div>
            )}

            {showAddHolding && <AddHoldingModal portfolioId={id} onClose={() => setShowAddHolding(false)} onAdded={fetchPortfolio} />}
        </div>
    );
}
