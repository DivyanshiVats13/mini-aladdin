import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function PortfolioListPage() {
    const navigate = useNavigate();
    const [portfolios, setPortfolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newName, setNewName] = useState('');
    const [newCurrency, setNewCurrency] = useState('USD');
    const [creating, setCreating] = useState(false);
    const [deleting, setDeleting] = useState(null);

    const fetchPortfolios = async () => {
        try {
            const res = await axiosClient.get('/portfolios');
            if (res.data?.success) setPortfolios(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch portfolios:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPortfolios(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            await axiosClient.post('/portfolios', { name: newName, currency: newCurrency });
            setNewName('');
            setNewCurrency('USD');
            setShowCreate(false);
            fetchPortfolios();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create portfolio');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (e, portfolioId, portfolioName) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm(`Delete "${portfolioName}"? This will remove all holdings. This action cannot be undone.`)) return;
        setDeleting(portfolioId);
        try {
            await axiosClient.delete(`/portfolios/${portfolioId}`);
            fetchPortfolios();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete portfolio');
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                        Portfolios
                    </h1>
                    <p className="mt-1" style={{ color: 'var(--color-text-muted)' }}>
                        Manage your investment portfolios
                    </p>
                </div>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer"
                    style={{ background: 'var(--color-teal-500)', color: 'var(--color-navy-950)' }}
                >
                    + New Portfolio
                </button>
            </div>

            {/* Create form */}
            {showCreate && (
                <div className="glass-card p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                        Create New Portfolio
                    </h3>
                    <form onSubmit={handleCreate} className="flex flex-col gap-4">
                        <input
                            type="text" value={newName} onChange={e => setNewName(e.target.value)}
                            required placeholder="Portfolio Name (e.g., Retirement, Trading)"
                            className="px-4 py-3 rounded-lg text-sm outline-none"
                            style={{ background: 'var(--color-navy-800)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }}
                        />
                        <select value={newCurrency} onChange={e => setNewCurrency(e.target.value)}
                            className="px-4 py-3 rounded-lg text-sm outline-none"
                            style={{ background: 'var(--color-navy-800)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }}>
                            <option value="USD">USD — US Dollar</option>
                            <option value="INR">INR — Indian Rupee</option>
                        </select>
                        <div className="flex gap-3">
                            <button type="submit" disabled={creating}
                                className="px-6 py-2 rounded-lg text-sm font-semibold cursor-pointer"
                                style={{ background: 'var(--color-teal-500)', color: 'var(--color-navy-950)' }}>
                                {creating ? 'Creating...' : 'Create'}
                            </button>
                            <button type="button" onClick={() => setShowCreate(false)}
                                className="px-6 py-2 rounded-lg text-sm font-medium cursor-pointer"
                                style={{ background: 'var(--color-navy-700)', color: 'var(--color-text-secondary)' }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Portfolio list */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="glass-card p-6 animate-pulse">
                            <div className="h-5 w-32 rounded mb-2" style={{ background: 'var(--color-navy-700)' }} />
                            <div className="h-3 w-24 rounded mb-6" style={{ background: 'var(--color-navy-700)' }} />
                            <div className="h-8 w-40 rounded" style={{ background: 'var(--color-navy-700)' }} />
                        </div>
                    ))}
                </div>
            ) : portfolios.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <p className="text-4xl mb-4">💼</p>
                    <p className="text-lg mb-2" style={{ color: 'var(--color-text-secondary)' }}>No portfolios yet</p>
                    <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
                        Click "New Portfolio" to create your first investment portfolio.
                    </p>
                    <button onClick={() => setShowCreate(true)}
                        className="px-6 py-2 rounded-lg text-sm font-semibold cursor-pointer"
                        style={{ background: 'var(--color-teal-500)', color: 'var(--color-navy-950)' }}>
                        + Create Portfolio
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolios.map(p => (
                        <Link key={p.id} to={`/portfolios/${p.id}`} className="block no-underline group">
                            <div className="glass-card p-6 transition-all duration-300 hover:scale-[1.02] relative"
                                style={{ cursor: 'pointer' }}>
                                {/* Delete button */}
                                <button
                                    onClick={(e) => handleDelete(e, p.id, p.name)}
                                    disabled={deleting === p.id}
                                    className="absolute top-3 right-3 w-7 h-7 rounded-md flex items-center justify-center text-xs 
                                               opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                                    style={{
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        color: 'var(--color-red-500)',
                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                    }}
                                    title="Delete portfolio"
                                >
                                    {deleting === p.id ? '…' : '✕'}
                                </button>

                                <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                                    {p.name}
                                </h3>
                                <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
                                    {p.currency || 'USD'} · {(p.holdings || []).length} holding{(p.holdings || []).length !== 1 ? 's' : ''}
                                </p>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Total Value</p>
                                        <p className="text-xl font-bold" style={{ color: 'var(--color-teal-400)' }}>
                                            ${Number(p.totalValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>P&L</p>
                                        <p className="text-sm font-semibold"
                                            style={{ color: (p.totalPnL || 0) >= 0 ? 'var(--color-green-400)' : 'var(--color-red-500)' }}>
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
