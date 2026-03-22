import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

/**
 * Protected layout: sidebar + main content.
 * Redirects to /login if not authenticated.
 */
export default function AppLayout() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin mx-auto mb-3"
                        style={{ borderColor: 'var(--color-teal-400)', borderTopColor: 'transparent' }} />
                    <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto"
                style={{ background: 'var(--color-navy-950)' }}>
                <Outlet />
            </main>
        </div>
    );
}
