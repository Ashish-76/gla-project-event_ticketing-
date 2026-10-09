import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
    Ticket, 
    Calendar, 
    LayoutDashboard, 
    ShieldCheck, 
    User, 
    LogOut, 
    Menu, 
    X, 
    QrCode, 
    PlusCircle,
    Bookmark
} from "lucide-react";
import Badge from "../UI/Badge";

const Navbar = () => {
    const { user, isAuthenticated, logout, isAdmin, isOrganizer } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setUserDropdownOpen(false);
        setMobileMenuOpen(false);
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid var(--border-light)",
            boxShadow: "var(--shadow-sm)"
        }}>
            <div className="container" style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: "72px"
            }}>
                {/* Brand Logo */}
                <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}>
                    <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        boxShadow: "0 4px 10px rgba(79, 70, 229, 0.3)"
                    }}>
                        <Ticket size={22} />
                    </div>
                    <div>
                        <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.02em" }}>
                            Event<span style={{ color: "var(--primary)" }}>ix</span>
                        </span>
                        <span style={{ display: "block", fontSize: "0.625rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "-3px" }}>
                            Ticketing Hub
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation Links */}
                <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} className="desktop-nav">
                    <Link
                        to="/events"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.375rem",
                            padding: "0.5rem 0.875rem",
                            borderRadius: "var(--radius-md)",
                            fontSize: "0.9375rem",
                            fontWeight: 600,
                            color: isActive("/events") ? "var(--primary)" : "var(--text-main)",
                            background: isActive("/events") ? "var(--primary-light)" : "transparent",
                            transition: "all var(--transition-fast)"
                        }}
                    >
                        <Calendar size={18} />
                        Explore Events
                    </Link>

                    {isAuthenticated && (
                        <Link
                            to="/my-bookings"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.375rem",
                                padding: "0.5rem 0.875rem",
                                borderRadius: "var(--radius-md)",
                                fontSize: "0.9375rem",
                                fontWeight: 600,
                                color: isActive("/my-bookings") ? "var(--primary)" : "var(--text-main)",
                                background: isActive("/my-bookings") ? "var(--primary-light)" : "transparent",
                                transition: "all var(--transition-fast)"
                            }}
                        >
                            <Bookmark size={18} />
                            My Tickets
                        </Link>
                    )}

                    {isOrganizer && (
                        <Link
                            to="/organizer"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.375rem",
                                padding: "0.5rem 0.875rem",
                                borderRadius: "var(--radius-md)",
                                fontSize: "0.9375rem",
                                fontWeight: 600,
                                color: location.pathname.startsWith("/organizer") ? "var(--primary)" : "var(--text-main)",
                                background: location.pathname.startsWith("/organizer") ? "var(--primary-light)" : "transparent",
                                transition: "all var(--transition-fast)"
                            }}
                        >
                            <LayoutDashboard size={18} />
                            Organizer Hub
                        </Link>
                    )}

                    {isAdmin && (
                        <Link
                            to="/admin"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.375rem",
                                padding: "0.5rem 0.875rem",
                                borderRadius: "var(--radius-md)",
                                fontSize: "0.9375rem",
                                fontWeight: 600,
                                color: isActive("/admin") ? "var(--primary)" : "var(--text-main)",
                                background: isActive("/admin") ? "var(--primary-light)" : "transparent",
                                transition: "all var(--transition-fast)"
                            }}
                        >
                            <ShieldCheck size={18} />
                            Admin Panel
                        </Link>
                    )}
                </nav>

                {/* Right Action / Auth Menu */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                    {isAuthenticated ? (
                        <div style={{ position: "relative" }}>
                            <button
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.625rem",
                                    padding: "0.375rem 0.75rem",
                                    borderRadius: "var(--radius-full)",
                                    border: "1px solid var(--border-light)",
                                    background: "white",
                                    boxShadow: "var(--shadow-sm)"
                                }}
                            >
                                <img
                                    src={user?.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"}
                                    alt={user?.name}
                                    style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
                                />
                                <div style={{ textAlign: "left" }} className="user-nav-text">
                                    <span style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-main)" }}>
                                        {user?.name?.split(" ")[0]}
                                    </span>
                                </div>
                                <Badge status={user?.role}>{user?.role}</Badge>
                            </button>

                            {/* Dropdown Menu */}
                            {userDropdownOpen && (
                                <div
                                    style={{
                                        position: "absolute",
                                        right: 0,
                                        top: "120%",
                                        width: "220px",
                                        background: "white",
                                        borderRadius: "var(--radius-lg)",
                                        boxShadow: "var(--shadow-xl)",
                                        border: "1px solid var(--border-light)",
                                        padding: "0.5rem",
                                        zIndex: 110,
                                        animation: "fadeIn 0.2s ease-out"
                                    }}
                                    onClick={() => setUserDropdownOpen(false)}
                                >
                                    <div style={{ padding: "0.75rem", borderBottom: "1px solid var(--border-light)" }}>
                                        <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-main)" }}>{user?.name}</p>
                                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.email}</p>
                                    </div>

                                    <Link
                                        to="/profile"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            padding: "0.625rem 0.75rem",
                                            fontSize: "0.875rem",
                                            fontWeight: 600,
                                            color: "var(--text-main)",
                                            borderRadius: "var(--radius-md)",
                                            textDecoration: "none"
                                        }}
                                        className="dropdown-item"
                                    >
                                        <User size={16} />
                                        My Profile
                                    </Link>

                                    {isOrganizer && (
                                        <Link
                                            to="/organizer/scanner"
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.5rem",
                                                padding: "0.625rem 0.75rem",
                                                fontSize: "0.875rem",
                                                fontWeight: 600,
                                                color: "var(--primary)",
                                                borderRadius: "var(--radius-md)",
                                                textDecoration: "none"
                                            }}
                                            className="dropdown-item"
                                        >
                                            <QrCode size={16} />
                                            Venue QR Scanner
                                        </Link>
                                    )}

                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            padding: "0.625rem 0.75rem",
                                            fontSize: "0.875rem",
                                            fontWeight: 600,
                                            color: "var(--danger)",
                                            borderRadius: "var(--radius-md)",
                                            marginTop: "0.25rem",
                                            borderTop: "1px solid var(--border-light)"
                                        }}
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                            <Link to="/login" className="btn btn-secondary btn-sm">
                                Log In
                            </Link>
                            <Link to="/register" className="btn btn-primary btn-sm">
                                Register
                            </Link>
                        </div>
                    )}

                    {/* Mobile Hamburger Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{
                            display: "none",
                            padding: "0.5rem",
                            color: "var(--text-main)"
                        }}
                        className="mobile-nav-toggle"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Drawer */}
            {mobileMenuOpen && (
                <div style={{
                    padding: "1rem 1.5rem 1.5rem",
                    background: "white",
                    borderTop: "1px solid var(--border-light)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem"
                }}>
                    <Link
                        to="/events"
                        onClick={() => setMobileMenuOpen(false)}
                        className="btn btn-secondary"
                        style={{ justifyContent: "flex-start" }}
                    >
                        <Calendar size={18} />
                        Explore Events
                    </Link>

                    {isAuthenticated && (
                        <Link
                            to="/my-bookings"
                            onClick={() => setMobileMenuOpen(false)}
                            className="btn btn-secondary"
                            style={{ justifyContent: "flex-start" }}
                        >
                            <Bookmark size={18} />
                            My Tickets
                        </Link>
                    )}

                    {isOrganizer && (
                        <>
                            <Link
                                to="/organizer"
                                onClick={() => setMobileMenuOpen(false)}
                                className="btn btn-secondary"
                                style={{ justifyContent: "flex-start" }}
                            >
                                <LayoutDashboard size={18} />
                                Organizer Hub
                            </Link>
                            <Link
                                to="/organizer/scanner"
                                onClick={() => setMobileMenuOpen(false)}
                                className="btn btn-secondary"
                                style={{ justifyContent: "flex-start", color: "var(--primary)" }}
                            >
                                <QrCode size={18} />
                                Venue QR Scanner
                            </Link>
                        </>
                    )}

                    {isAdmin && (
                        <Link
                            to="/admin"
                            onClick={() => setMobileMenuOpen(false)}
                            className="btn btn-secondary"
                            style={{ justifyContent: "flex-start" }}
                        >
                            <ShieldCheck size={18} />
                            Admin Panel
                        </Link>
                    )}

                    {isAuthenticated && (
                        <Link
                            to="/profile"
                            onClick={() => setMobileMenuOpen(false)}
                            className="btn btn-secondary"
                            style={{ justifyContent: "flex-start" }}
                        >
                            <User size={18} />
                            My Profile
                        </Link>
                    )}
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .desktop-nav { display: none !important; }
                    .mobile-nav-toggle { display: block !important; }
                    .user-nav-text { display: none !important; }
                }
                .dropdown-item:hover {
                    background-color: var(--bg-subtle);
                }
            `}</style>
        </header>
    );
};

export default Navbar;
