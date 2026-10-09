import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// Dynamically detect host (e.g. localhost, 192.168.x.x for mobile Wi-Fi testing, or production URL)
const currentHost = typeof window !== "undefined" && window.location.hostname ? window.location.hostname : "localhost";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://${currentHost}:4000/api`;

// Create custom axios instance
export const api = axios.create({
    baseURL: API_BASE_URL
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("Token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("Token") || "");
    const [loading, setLoading] = useState(true);

    // Initial auth check
    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem("Token");
            const storedUser = localStorage.getItem("User");

            if (storedToken && storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                    setToken(storedToken);

                    // Fetch latest profile from server
                    const res = await api.get("/auth/me");
                    if (res.data.success && res.data.user) {
                        setUser(res.data.user);
                        localStorage.setItem("User", JSON.stringify(res.data.user));
                    }
                } catch (err) {
                    console.error("Auth verification failed:", err);
                    if (err.response?.status === 401) {
                        logout();
                    }
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    // Login Function
    const login = async (email, password) => {
        const response = await api.post("/auth/login", { email, password });
        if (response.data.success) {
            const { token: newToken, user: newUser } = response.data;
            localStorage.setItem("Token", newToken);
            localStorage.setItem("User", JSON.stringify(newUser));
            setToken(newToken);
            setUser(newUser);
            return response.data;
        }
        throw new Error(response.data.message || "Login failed");
    };

    // Register Function
    const register = async (userData) => {
        const response = await api.post("/auth/register", userData);
        if (response.data.success) {
            const { token: newToken, user: newUser } = response.data;
            localStorage.setItem("Token", newToken);
            localStorage.setItem("User", JSON.stringify(newUser));
            setToken(newToken);
            setUser(newUser);
            return response.data;
        }
        throw new Error(response.data.message || "Registration failed");
    };

    // Logout Function
    const logout = () => {
        localStorage.removeItem("Token");
        localStorage.removeItem("User");
        setToken("");
        setUser(null);
    };

    // Update Profile
    const updateProfile = async (profileData) => {
        const response = await api.put("/auth/profile", profileData);
        if (response.data.success) {
            const updatedUser = response.data.user;
            setUser(updatedUser);
            localStorage.setItem("User", JSON.stringify(updatedUser));
            return response.data;
        }
        throw new Error(response.data.message || "Failed to update profile");
    };

    // Change Password
    const changePassword = async (passwords) => {
        const response = await api.put("/auth/change-password", passwords);
        return response.data;
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === "admin",
        isOrganizer: user?.role === "organizer" || user?.role === "admin",
        isAttendee: user?.role === "attendee"
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
