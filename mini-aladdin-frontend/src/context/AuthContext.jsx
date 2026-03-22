import { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('ma_token'));
    const [loading, setLoading] = useState(true);

    // On mount, if we have a stored token, fetch user profile
    useEffect(() => {
        if (token) {
            axiosClient.get('/auth/me')
                .then(res => {
                    if (res.data?.success) {
                        setUser(res.data.data);
                    } else {
                        logout();
                    }
                })
                .catch(() => logout())
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const res = await axiosClient.post('/auth/login', { email, password });
        const { token: jwt, email: userEmail, fullName, tier } = res.data.data;
        localStorage.setItem('ma_token', jwt);
        setToken(jwt);
        setUser({ email: userEmail, fullName, tier });
        return res.data;
    };

    const register = async (email, password, fullName) => {
        const res = await axiosClient.post('/auth/register', { email, password, fullName });
        const { token: jwt, email: userEmail, fullName: name, tier } = res.data.data;
        localStorage.setItem('ma_token', jwt);
        setToken(jwt);
        setUser({ email: userEmail, fullName: name, tier });
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('ma_token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

export default AuthContext;
