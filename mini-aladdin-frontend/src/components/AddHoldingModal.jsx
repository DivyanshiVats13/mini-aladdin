import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const C = { primary: '#059669', primaryDk: '#047857', txt: '#111827', sub: '#4B5563', muted: '#6B7280', border: '#E5E7EB', green: '#16A34A' };

export default function AddHoldingModal({ portfolioId, onClose, onAdded }) {
    const [query, setQuery] = useState('');
    const [assets, setAssets] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [buyPrice, setBuyPrice] = useState('');
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        if (query.length < 1) { setAssets([]); return; }
        const timer = setTimeout(async () => {
            setSearching(true);
            try { const res = await axiosClient.get(`/assets?search=${encodeURIComponent(query)}`); if (res.data?.success) setAssets(res.data.data || []); }
            catch { setAssets([]); }
            finally { setSearching(false); }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedAsset) return;
        setLoading(true);
        try {
            await axiosClient.post(`/portfolios/${portfolioId}/holdings`, {
                assetId: selectedAsset.id, quantity: parseFloat(quantity), avgBuyPrice: parseFloat(buyPrice),
            });
            onAdded(); onClose();
        } catch (err) { alert(err.response?.data?.message || 'Failed to add holding'); }
        finally { setLoading(false); }
    };

    const inputStyle = { background: '#fff', color: C.txt, border: `1px solid ${C.border}` };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
            <div className="card p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold" style={{ color: C.txt }}>Add Holding</h2>
                    <button onClick={onClose} className="text-xl cursor-pointer" style={{ color: C.muted }}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: C.sub }}>Search Asset</label>
                        <input type="text" value={query} onChange={e => { setQuery(e.target.value); setSelectedAsset(null); }}
                            placeholder="Search by ticker or name..." className="w-full px-4 py-3 rounded-lg text-sm outline-none" style={inputStyle} />
                        {searching && <p className="text-xs mt-1" style={{ color: C.muted }}>Searching...</p>}

                        {assets.length > 0 && !selectedAsset && (
                            <div className="mt-2 rounded-lg overflow-hidden" style={{ border: `1px solid ${C.border}`, background: '#fff' }}>
                                {assets.slice(0, 8).map(a => (
                                    <button key={a.id} type="button"
                                        onClick={() => { setSelectedAsset(a); setQuery(`${a.ticker} — ${a.name}`); setAssets([]); }}
                                        className="w-full text-left px-4 py-2 text-sm flex justify-between items-center cursor-pointer hover:bg-gray-50"
                                        style={{ color: C.txt, borderBottom: `1px solid ${C.border}` }}>
                                        <span><strong style={{ color: C.primaryDk }}>{a.ticker}</strong> — {a.name}</span>
                                        <span className="text-xs" style={{ color: C.muted }}>{a.assetType}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {selectedAsset && (
                            <p className="text-xs mt-1" style={{ color: C.green }}>✓ Selected: {selectedAsset.ticker} — {selectedAsset.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: C.sub }}>Quantity</label>
                        <input type="number" step="any" min="0.01" value={quantity} onChange={e => setQuantity(e.target.value)}
                            required placeholder="e.g., 10" className="w-full px-4 py-3 rounded-lg text-sm outline-none" style={inputStyle} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: C.sub }}>Buy Price ($)</label>
                        <input type="number" step="0.01" min="0.01" value={buyPrice} onChange={e => setBuyPrice(e.target.value)}
                            required placeholder="e.g., 150.00" className="w-full px-4 py-3 rounded-lg text-sm outline-none" style={inputStyle} />
                    </div>

                    <div className="flex gap-3 mt-2">
                        <button type="submit" disabled={loading || !selectedAsset}
                            className="flex-1 py-3 rounded-lg text-sm font-semibold cursor-pointer text-white"
                            style={{ background: (!selectedAsset || loading) ? '#9CA3AF' : C.primary }}>
                            {loading ? 'Adding...' : 'Add Holding'}
                        </button>
                        <button type="button" onClick={onClose}
                            className="px-6 py-3 rounded-lg text-sm font-medium cursor-pointer"
                            style={{ background: '#F3F4F6', color: C.sub }}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
