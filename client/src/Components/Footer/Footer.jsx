import React from "react";
import { Link } from "react-router-dom";
import { Ticket, Mail, Phone, MapPin, Shield, Sparkles } from "lucide-react";

const Footer = () => {
    return (
        <footer style={{
            background: "#0f172a",
            color: "#94a3b8",
            paddingTop: "4rem",
            paddingBottom: "2rem",
            borderTop: "1px solid #1e293b",
            marginTop: "auto"
        }}>
            <div className="container">
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "2.5rem",
                    marginBottom: "3rem"
                }}>
                    {/* Brand Info */}
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1rem" }}>
                            <div style={{
                                width: 36,
                                height: 36,
                                borderRadius: "10px",
                                background: "linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white"
                            }}>
                                <Ticket size={20} />
                            </div>
                            <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "white" }}>
                                Event<span style={{ color: "var(--secondary)" }}>ix</span>
                            </span>
                        </div>
                        <p style={{ fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                            The next-generation digital ticketing platform designed for seamless event discovery, instant QR e-ticket issuance, and fraud-free venue check-in verification.
                        </p>
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "#38bdf8", background: "rgba(56, 189, 248, 0.1)", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>
                                <Shield size={12} /> Secure MERN Stack
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "#34d399", background: "rgba(52, 211, 153, 0.1)", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>
                                <Sparkles size={12} /> QR Verified
                            </span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ color: "white", fontSize: "0.9375rem", fontWeight: 700, marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Explore
                        </h4>
                        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
                            <li><Link to="/events" style={{ color: "inherit", transition: "color 0.2s" }} onMouseEnter={(e) => e.target.style.color = "white"} onMouseLeave={(e) => e.target.style.color = "inherit"}>All Events</Link></li>
                            <li><Link to="/events?category=Music" style={{ color: "inherit" }}>Concerts & Music</Link></li>
                            <li><Link to="/events?category=Tech" style={{ color: "inherit" }}>Tech Summits</Link></li>
                            <li><Link to="/events?category=Sports" style={{ color: "inherit" }}>Sports Tournaments</Link></li>
                            <li><Link to="/events?category=Workshops" style={{ color: "inherit" }}>Workshops & Seminars</Link></li>
                        </ul>
                    </div>

                    {/* For Organizers */}
                    <div>
                        <h4 style={{ color: "white", fontSize: "0.9375rem", fontWeight: 700, marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            For Organizers
                        </h4>
                        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
                            <li><Link to="/organizer" style={{ color: "inherit" }}>Organizer Dashboard</Link></li>
                            <li><Link to="/organizer/events/create" style={{ color: "inherit" }}>Publish an Event</Link></li>
                            <li><Link to="/organizer/scanner" style={{ color: "inherit" }}>Venue QR Scanner</Link></li>
                            <li><Link to="/organizer/events" style={{ color: "inherit" }}>Ticket Sales & Analytics</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Support */}
                    <div>
                        <h4 style={{ color: "white", fontSize: "0.9375rem", fontWeight: 700, marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Support & Contact
                        </h4>
                        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
                            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <Mail size={16} color="var(--primary)" /> support@eventix.com
                            </li>
                            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <Phone size={16} color="var(--primary)" /> +91 9389849873
                            </li>
                            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <MapPin size={16} color="var(--primary)" /> Mathura / Agra, India
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar - Centered Copyright */}
                <div style={{
                    paddingTop: "2rem",
                    borderTop: "1px solid #1e293b",
                    textAlign: "center",
                    fontSize: "0.875rem",
                    color: "#94a3b8"
                }}>
                    <p>© 2026 Eventix Inc. All rights reserved. Capstone Project.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
