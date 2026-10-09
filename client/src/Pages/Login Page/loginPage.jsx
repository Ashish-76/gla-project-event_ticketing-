import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Ticket, Lock, Mail, Eye, EyeOff, ShieldCheck, UserCheck, Calendar } from "lucide-react";

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const from = location.state?.from?.pathname || "/";

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);

        try {
            const data = await login(formData.email, formData.password);
            const userRole = data.user.role;

            if (userRole === "admin") {
                navigate("/admin");
            } else if (userRole === "organizer") {
                navigate("/organizer");
            } else {
                navigate(from === "/login" || from === "/" ? "/events" : from);
            }
        } catch (err) {
            console.error("Login failed:", err);
            setErrorMsg(err.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    // Quick fill for demo testing
    const fillDemoCredentials = (email, password) => {
        setFormData({ email, password });
        setErrorMsg("");
    };

    return (
        <div style={{
            minHeight: "calc(100vh - 160px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem 1rem"
        }}>
            <div className="card" style={{ maxWidth: 480, width: "100%", padding: "2.5rem 2rem", boxShadow: "var(--shadow-xl)" }}>
                {/* Brand Header */}
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: "14px",
                        background: "linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%)",
                        color: "white",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "1rem"
                    }}>
                        <Ticket size={26} />
                    </div>
                    <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.375rem" }}>
                        Welcome to Eventix
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                        Sign in to access your digital tickets & event dashboard
                    </p>
                </div>

                {/* 1-Click Demo Accounts Pill Bar */}
                <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "var(--bg-main)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
                    <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.625rem", textAlign: "center" }}>
                        ⚡ 1-Click Demo Accounts Quick-Fill:
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                        <button
                            type="button"
                            onClick={() => fillDemoCredentials("admin@eventix.com", "admin123")}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: "0.75rem", padding: "0.375rem 0.25rem" }}
                        >
                            👑 Admin
                        </button>
                        <button
                            type="button"
                            onClick={() => fillDemoCredentials("organizer@eventix.com", "organizer123")}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: "0.75rem", padding: "0.375rem 0.25rem" }}
                        >
                            🎪 Organizer
                        </button>
                        <button
                            type="button"
                            onClick={() => fillDemoCredentials("attendee@eventix.com", "attendee123")}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: "0.75rem", padding: "0.375rem 0.25rem" }}
                        >
                            🎟️ Attendee
                        </button>
                    </div>
                </div>

                {errorMsg && (
                    <div style={{ padding: "0.75rem 1rem", background: "var(--danger-light)", color: "var(--danger)", borderRadius: "var(--radius-md)", fontSize: "0.875rem", fontWeight: 600, marginBottom: "1.25rem" }}>
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Email Address</label>
                        <div style={{ position: "relative" }}>
                            <Mail size={18} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                            <input
                                type="email"
                                name="email"
                                placeholder="name@domain.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-input"
                                style={{ paddingLeft: "2.5rem" }}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Password</label>
                        <div style={{ position: "relative" }}>
                            <Lock size={18} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className="form-input"
                                style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary btn-lg"
                        style={{ width: "100%", marginTop: "0.5rem" }}
                    >
                        {loading ? "Signing in..." : "Sign In to Account"}
                    </button>
                </form>

                <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "1.75rem" }}>
                    Don't have an account?{" "}
                    <Link to="/register" style={{ color: "var(--primary)", fontWeight: 700 }}>
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;