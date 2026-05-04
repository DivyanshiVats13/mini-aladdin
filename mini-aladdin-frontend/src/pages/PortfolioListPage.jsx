import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const C = { primary: '#059669', primaryDk: '#047857', txt: '#111827', sub: '#4B5563', muted: '#6B7280', border: '#E5E7EB', bg2: '#F3F4F6', green: '#16A34A', red: '#DC2626' };

export default function PortfolioListPage() {
    const [portfolios, setPortfolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newName, setNewName] = useState('');
    const [newCurrency, setNewCurrency] = useState('USD');
    const [creating, setCreating] = useState(false);
    const [deleting, setDeleting] = useState(null);

    const fetchPortfolios = async () => {
        try { const res = await axiosClient.get('/portfolios'); if (res.data?.success) setPortfolios(res.data.data || []); }
        catch { } finally { setLoading(false); }
    };
    useEffect(() => { fetchPortfolios(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault(); setCreating(true);
        try { await axiosClient.post('/portfolios', { name: newName, currency: newCurrency }); setNewName(''); setShowCreate(false); fetchPortfolios(); }
        catch (err) { alert(err.response?.data?.message || 'Failed to create portfolio'); }
        finally { setCreating(false); }
    };

    const handleDelete = async (e, id, name) => {
        e.preventDefault(); e.stopPropagation();
        if (!confirm(`Delete "${name}"? This will remove all holdings.`)) return;
        setDeleting(id);
        try { await axiosClient.delete(`/portfolios/${id}`); fetchPortfolios(); }
        catch (err) { alert(err.response?.data?.message || 'Failed to delete'); }
        finally { setDeleting(null); }
    };

    const inputStyle = { background: '#fff', color: C.txt, border: `1px solid ${C.border}` };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: C.txt }}>Portfolios</h1>
                    <p className="mt-1" style={{ color: C.muted }}>Manage your investment portfolios</p>
                </div>
                <button onClick={() => setShowCreate(!showCreate)}
                    className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer text-white"
                    style={{ background: C.primary }}>+ New Portfolio</button>
            </div>

            {showCreate && (
                <div className="card p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4" style={{ color: C.txt }}>Create New Portfolio</h3>
                    <form onSubmit={handleCreate} className="flex flex-col gap-4">
                        <input type="text" value={newName} onChange={e => setNewName(e.target.value)} required
                            placeholder="Portfolio Name (e.g., Retirement, Trading)"
                            className="px-4 py-3 rounded-lg text-sm outline-none" style={inputStyle} />
                        <select value={newCurrency} onChange={e => setNewCurrency(e.target.value)}
                            className="px-4 py-3 rounded-lg text-sm outline-none" style={inputStyle}>
                            <option value="USD">USD — US Dollar</option>
                            <option value="INR">INR — Indian Rupee</option>
                        </select>
                        <div className="flex gap-3">
                            <button type="submit" disabled={creating} className="px-6 py-2 rounded-lg text-sm font-semibold cursor-pointer text-white"
                                style={{ background: C.primary }}>{creating ? 'Creating...' : 'Create'}</button>
                            <button type="button" onClick={() => setShowCreate(false)}
                                className="px-6 py-2 rounded-lg text-sm font-medium cursor-pointer"
                                style={{ background: C.bg2, color: C.sub }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="card p-6 animate-pulse">
                            <div className="h-5 w-32 rounded mb-2" style={{ background: C.bg2 }} />
                            <div className="h-3 w-24 rounded mb-6" style={{ background: C.bg2 }} />
                            <div className="h-8 w-40 rounded" style={{ background: C.bg2 }} />
                        </div>
                    ))}
                </div>
            ) : portfolios.length === 0 ? (
                <div className="card p-12 text-center">
                    <p className="text-4xl mb-4">💼</p>
                    <p className="text-lg mb-2" style={{ color: C.sub }}>No portfolios yet</p>
                    <p className="text-sm mb-6" style={{ color: C.muted }}>Click "New Portfolio" to create your first.</p>
                    <button onClick={() => setShowCreate(true)} className="px-6 py-2 rounded-lg text-sm font-semibold cursor-pointer text-white"
                        style={{ background: C.primary }}>+ Create Portfolio</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolios.map(p => (
                        <Link key={p.id} to={`/portfolios/${p.id}`} className="block no-underline group">
                            <div className="card p-6 transition-all duration-300 hover:shadow-md relative" style={{ cursor: 'pointer' }}>
                                <button onClick={(e) => handleDelete(e, p.id, p.name)} disabled={deleting === p.id}
                                    className="absolute top-3 right-3 w-7 h-7 rounded-md flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    style={{ background: '#FEF2F2', color: C.red, border: '1px solid #FECACA' }} title="Delete">
                                    {deleting === p.id ? '…' : '✕'}
                                </button>
                                <h3 className="text-lg font-semibold mb-1" style={{ color: C.txt }}>{p.name}</h3>
                                <p className="text-sm mb-4" style={{ color: C.muted }}>
                                    {p.currency || 'USD'} · {(p.holdings || []).length} holding{(p.holdings || []).length !== 1 ? 's' : ''}
                                </p>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs" style={{ color: C.muted }}>Total Value</p>
                                        <p className="text-xl font-bold" style={{ color: C.primaryDk }}>
                                            ${Number(p.totalValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs" style={{ color: C.muted }}>P&L</p>
                                        <p className="text-sm font-semibold" style={{ color: (p.totalPnL || 0) >= 0 ? C.green : C.red }}>
                                            {(p.totalPnL || 0) >= 0 ? '+' : ''}${Number(p.totalPnL || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
