import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    }, []);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const isExpired = decoded.exp * 1000 < Date.now();
                if (isExpired) {
                    logout();
                } else {
                    const mappedUser = {
                        id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || decoded.sub,
                        email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || decoded.email,
                        name: (decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || decoded.email)?.split('@')[0]
                    };
                    setUser(mappedUser);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }
            } catch (e) {
                console.error("Token validation error:", e);
                logout();
            }
        }
        setLoading(false);
    }, [token, logout]);

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            const { token, user: userData } = response.data;

            localStorage.setItem('token', token);
            setToken(token);
            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: error.response?.data?.message || 'Login failed. Please check your credentials.' };
        }
    };

    const register = async (userData) => {
        try {
            const apiData = {
                Email: userData.email,
                Password: userData.password,
                FullName: userData.name
            };
            await axios.post('/api/auth/register', apiData);
            return { success: true };
        } catch (error) {
            console.error("Registration error:", error);
            let message = 'Registration failed. Please try again.';

            if (error.response?.data) {
                const data = error.response.data;
                if (Array.isArray(data)) {
                    // Handle IdentityError[]
                    message = data.map(err => err.description || err.Description || JSON.stringify(err)).join(', ');
                } else if (typeof data === 'object') {
                    // Handle ValidationProblemDetails or other object formats
                    message = Object.values(data).flat().map(val =>
                        typeof val === 'object' ? (val.description || val.Description || JSON.stringify(val)) : val
                    ).join(', ');
                } else {
                    message = data.toString();
                }
            }
            return { success: false, message };
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
