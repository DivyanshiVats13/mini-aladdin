import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

export default function PortfolioListPage() {
    const { user } = useAuth();
    const [portfolios, setPortfolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newName, setNewName] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [creating, setCreating] = useState(false);

    const fetchPortfolios = async () => {
        try {
            const res = await axiosClient.get('/portfolios', {
                headers: { 'X-User-Id': user?.id || '00000000-0000-0000-0000-000000000000' }
            });
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
            await axiosClient.post('/portfolios', { name: newName, description: newDesc }, {
                headers: { 'X-User-Id': user?.id || '00000000-0000-0000-0000-000000000000' }
            });
            setNewName('');
            setNewDesc('');
            setShowCreate(false);
            fetchPortfolios();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create portfolio');
        } finally {
            setCreating(false);
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
                            required placeholder="Portfolio Name"
                            className="px-4 py-3 rounded-lg text-sm outline-none"
                            style={{ background: 'var(--color-navy-800)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }}
                        />
                        <input
                            type="text" value={newDesc} onChange={e => setNewDesc(e.target.value)}
                            placeholder="Description (optional)"
                            className="px-4 py-3 rounded-lg text-sm outline-none"
                            style={{ background: 'var(--color-navy-800)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }}
                        />
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
                <div className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>Loading portfolios...</div>
            ) : portfolios.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <p className="text-lg mb-2" style={{ color: 'var(--color-text-secondary)' }}>No portfolios yet</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        Click "New Portfolio" to create your first investment portfolio.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolios.map(p => (
                        <Link key={p.id} to={`/portfolios/${p.id}`} className="block no-underline">
                            <div className="glass-card p-6 transition-all duration-200 hover:scale-[1.02]"
                                style={{ cursor: 'pointer' }}>
                                <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                                    {p.name}
                                </h3>
                                <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
                                    {p.description || 'No description'}
                                </p>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Total Value</p>
                                        <p className="text-xl font-bold" style={{ color: 'var(--color-teal-400)' }}>
                                            ${(p.totalValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                        {p.holdingCount || 0} holdings
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
