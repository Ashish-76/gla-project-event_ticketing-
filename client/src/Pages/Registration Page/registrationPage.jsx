import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Ticket, User, Mail, Phone, Lock, Eye, EyeOff, Sparkles, UserCheck, Calendar } from "lucide-react";

const RegistrationPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "attendee"
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        if (formData.password.length < 6) {
            setErrorMsg("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);
        try {
            const data = await register(formData);
            const userRole = data.user.role;

            alert("🎉 Registration successful! Welcome to Eventix.");
            if (userRole === "organizer") {
                navigate("/organizer");
            } else {
                navigate("/events");
            }
        } catch (err) {
            console.error("Registration error:", err);
            setErrorMsg(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "calc(100vh - 160px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem 1rem"
        }}>
            <div className="card" style={{ maxWidth: 520, width: "100%", padding: "2.5rem 2rem", boxShadow: "var(--shadow-xl)" }}>
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
                        Join Eventix
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                        Create an account to book tickets or host live events across India
                    </p>
                </div>

                {/* Role Switcher Tab */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.5rem",
                    padding: "0.375rem",
                    background: "var(--bg-main)",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--border-light)",
                    marginBottom: "1.75rem"
                }}>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: "attendee" })}
                        style={{
                            padding: "0.75rem",
                            borderRadius: "var(--radius-md)",
                            fontSize: "0.875rem",
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                            background: formData.role === "attendee" ? "white" : "transparent",
                            color: formData.role === "attendee" ? "var(--primary)" : "var(--text-muted)",
                            boxShadow: formData.role === "attendee" ? "var(--shadow-sm)" : "none"
                        }}
                    >
                        <UserCheck size={18} /> Attendee
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: "organizer" })}
                        style={{
                            padding: "0.75rem",
                            borderRadius: "var(--radius-md)",
                            fontSize: "0.875rem",
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                            background: formData.role === "organizer" ? "white" : "transparent",
                            color: formData.role === "organizer" ? "var(--primary)" : "var(--text-muted)",
                            boxShadow: formData.role === "organizer" ? "var(--shadow-sm)" : "none"
                        }}
                    >
                        <Calendar size={18} /> Event Organizer
                    </button>
                </div>

                {errorMsg && (
                    <div style={{ padding: "0.75rem 1rem", background: "var(--danger-light)", color: "var(--danger)", borderRadius: "var(--radius-md)", fontSize: "0.875rem", fontWeight: 600, marginBottom: "1.25rem" }}>
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Full Name *</label>
                        <div style={{ position: "relative" }}>
                            <User size={18} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-input"
                                style={{ paddingLeft: "2.5rem" }}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Email Address *</label>
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
                        <label className="form-label">Phone Number (Optional)</label>
                        <div style={{ position: "relative" }}>
                            <Phone size={18} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                            <input
                                type="text"
                                name="phone"
                                placeholder="+91 98765 43210"
                                value={formData.phone}
                                onChange={handleChange}
                                className="form-input"
                                style={{ paddingLeft: "2.5rem" }}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Create Password *</label>
                        <div style={{ position: "relative" }}>
                            <Lock size={18} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Min 6 characters"
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
                        {loading ? "Creating Account..." : `Register as ${formData.role === "organizer" ? "Organizer" : "Attendee"}`}
                    </button>
                </form>

                <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "1.75rem" }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: "var(--primary)", fontWeight: 700 }}>
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegistrationPage;