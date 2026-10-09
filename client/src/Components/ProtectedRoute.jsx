import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./UI/Loader";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading, isAuthenticated } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                <Loader text="Verifying authentication..." />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // Redirect unauthorized users to their natural dashboard
        if (user?.role === "admin") return <Navigate to="/admin" replace />;
        if (user?.role === "organizer") return <Navigate to="/organizer" replace />;
        return <Navigate to="/events" replace />;
    }

    return children;
};

export default ProtectedRoute;
