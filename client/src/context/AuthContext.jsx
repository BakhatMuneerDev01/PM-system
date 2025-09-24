import { createContext, useContext, useState, useEffect } from 'react';
import { users } from '../data/dummyData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadUser = async () => {
        setLoading(true);
        setError(null);
        const user = localStorage.getItem('user');
        try {
            if (user) {
                setUser(JSON.parse(user));
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const login = (userData) => {
        setLoading(true);
        setError(null);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = users.find(u => u.email === userData.email && u.password === userData.password);
                if (user) {
                    setUser(user);
                    localStorage.setItem('user', JSON.stringify(user));
                    resolve(user);
                } else {
                    setError('Invalid email or password');
                    reject(new Error('Invalid email or password'));
                }
                setLoading(false); // Ensure loading is set to false after the operation
            }, 3000);
        });
    };

    const signup = (userData) => {
        setLoading(true);
        setError(null);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = users.find(u => u.email === userData.email);
                if (user) {
                    setError('Email already exists');
                    reject(new Error('Email already exists'));
                } else {
                    users.push(userData);
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                    resolve(userData);
                }
                setLoading(false); // Ensure loading is set to false after the operation
            }, 3000);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };


    const value = {
        user,
        loading,
        error,
        login,
        signup,
        logout
    };
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context;
}