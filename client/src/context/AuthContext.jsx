import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, getProfile, updateProfile } from "../api/authApi";

// Create context
const AuthContext = createContext();

// Hook to use AuthContext easily
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);   // stores logged in user data
    const [loading, setLoading] = useState(true);

    // On mount, check if token exists -> fetch profile
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            getProfile()
                .then((res) => setUser(res.data))
                .catch(() => logout()); // token invalid -> logout
        }
        setLoading(false);
    }, []);

    // Register
    const register = async (data) => {
        const res = await registerUser(data);
        localStorage.setItem("token", res.data.token);
        setUser(res.data); // backend already returns user info + token
        return res.data;
    };

    // Login
    const login = async (data) => {
        const res = await loginUser(data);
        localStorage.setItem("token", res.data.token);
        setUser(res.data);
        return res.data;
    };

    // Update Profile

    const update = async (formData) => {
        try {
            console.log('📤 AuthContext: Sending update request...');
            const res = await updateProfile(formData);

            console.log('✅ AuthContext: Response received:', {
                username: res.data.username,
                hasProfileImage: !!res.data.profileImage,
                profileImageUrl: res.data.profileImage
            });

            // ✅ CRITICAL FIX: Merge response with existing user data
            // Always trust backend response for profileImage
            const updatedUserData = {
                ...user, // Preserve all existing user data first
                ...res.data, // Override with new data from response
                // ✅ Explicit profileImage handling
                profileImage: res.data.profileImage || user.profileImage || null
            };

            console.log('✅ Final user state:', {
                username: updatedUserData.username,
                profileImage: updatedUserData.profileImage
            });

            setUser(updatedUserData);

            // ✅ Update localStorage token if provided
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
            }

            return res.data;
        } catch (error) {
            console.error('❌ AuthContext: Update failed:', error);
            throw error;
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, update, logout }}>
            {children}
        </AuthContext.Provider>
    );
};