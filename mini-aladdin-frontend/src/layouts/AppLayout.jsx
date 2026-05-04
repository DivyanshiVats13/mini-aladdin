import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

export default function AppLayout() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F9FAFB' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '40px', height: '40px', border: '3px solid #10B981', borderTopColor: 'transparent',
                        borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 0.75rem',
                    }} />
                    <p style={{ color: '#6B7280' }}>Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <main style={{ flex: 1, marginLeft: '256px', padding: '2rem', background: '#F9FAFB', overflowY: 'auto' }}>
                <Outlet />
            </main>
        </div>
    );
}
