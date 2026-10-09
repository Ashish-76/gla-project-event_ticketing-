import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../context/AuthContext";
import { 
    Search, 
    Calendar, 
    MapPin, 
    Sparkles, 
    ShieldCheck, 
    QrCode, 
    TrendingUp, 
    ArrowRight, 
    Music, 
    Laptop, 
    Trophy, 
    Palette, 
    Briefcase, 
    Compass,
    CheckCircle2
} from "lucide-react";
import Loader from "../../Components/UI/Loader";

const HomePage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const res = await api.get("/events?status=published&limit=6");
                if (res.data.success) {
                    setFeaturedEvents(res.data.events || []);
                }
            } catch (err) {
                console.error("Home events fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate("/events");
        }
    };

    const categories = [
        { name: "Music", icon: Music, color: "#ec4899", bg: "#fdf2f8" },
        { name: "Tech", icon: Laptop, color: "#3b82f6", bg: "#eff6ff" },
        { name: "Sports", icon: Trophy, color: "#10b981", bg: "#ecfdf5" },
        { name: "Arts", icon: Palette, color: "#8b5cf6", bg: "#f5f3ff" },
        { name: "Workshops", icon: Briefcase, color: "#f59e0b", bg: "#fffbeb" },
        { name: "Travel", icon: Compass, color: "#06b6d4", bg: "#ecfeff" }
    ];

    return (
        <div>
            {/* HERO SECTION */}
            <section style={{
                position: "relative",
                background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)",
                color: "white",
                padding: "5rem 0 6rem",
                overflow: "hidden"
            }}>
                <div style={{
                    position: "absolute",
                    top: "-10%",
                    right: "-5%",
                    width: "500px",
                    height: "500px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(79, 70, 229, 0.3) 0%, rgba(0,0,0,0) 70%)",
                    filter: "blur(40px)",
                    pointerEvents: "none"
                }} />

                <div className="container" style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 900 }}>
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(8px)",
                        padding: "0.375rem 1rem",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        color: "#a5b4fc",
                        marginBottom: "1.5rem"
                    }}>
                        <Sparkles size={16} /> Next-Gen QR-Powered Event Ticketing Platform
                    </div>

                    <h1 style={{
                        fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
                        fontWeight: 800,
                        lineHeight: 1.15,
                        letterSpacing: "-0.03em",
                        marginBottom: "1.25rem"
                    }}>
                        Discover & Experience <br />
                        <span style={{
                            background: "linear-gradient(135deg, #818cf8 0%, #38bdf8 50%, #ec4899 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}>
                            Events That Move You
                        </span>
                    </h1>

                    <p style={{
                        fontSize: "clamp(1rem, 2vw, 1.25rem)",
                        color: "#cbd5e1",
                        maxWidth: 680,
                        margin: "0 auto 2.5rem",
                        lineHeight: 1.6
                    }}>
                        Book tickets seamlessly for concerts, tech conferences, sports tournaments, and workshops. Instant QR code issuance with fraud-proof venue gate verification.
                    </p>

                    {/* Search Bar in Hero */}
                    <form
                        onSubmit={handleSearchSubmit}
                        style={{
                            background: "white",
                            padding: "0.5rem",
                            borderRadius: "var(--radius-xl)",
                            display: "flex",
                            alignItems: "center",
                            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
                            maxWidth: 620,
                            margin: "0 auto",
                            gap: "0.5rem"
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, paddingLeft: "1rem" }}>
                            <Search size={20} color="var(--text-muted)" />
                            <input
                                type="text"
                                placeholder="Search by event title, artist, venue, or city..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    border: "none",
                                    outline: "none",
                                    width: "100%",
                                    fontSize: "0.9375rem",
                                    color: "var(--text-main)"
                                }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ padding: "0.75rem 1.5rem", borderRadius: "var(--radius-lg)" }}>
                            Find Events
                        </button>
                    </form>

                    {/* Stats strip */}
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "2.5rem",
                        flexWrap: "wrap",
                        marginTop: "3.5rem",
                        paddingTop: "2.5rem",
                        borderTop: "1px solid rgba(255, 255, 255, 0.1)"
                    }}>
                        <div>
                            <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "white" }}>10,000+</p>
                            <p style={{ fontSize: "0.8125rem", color: "#94a3b8" }}>Tickets Booked</p>
                        </div>
                        <div>
                            <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#38bdf8" }}>99.9%</p>
                            <p style={{ fontSize: "0.8125rem", color: "#94a3b8" }}>Fraud-Proof QR Scans</p>
                        </div>
                        <div>
                            <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#34d399" }}>500+</p>
                            <p style={{ fontSize: "0.8125rem", color: "#94a3b8" }}>Verified Organizers</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CATEGORIES PILLS SECTION */}
            <section style={{ padding: "3.5rem 0", background: "white", borderBottom: "1px solid var(--border-light)" }}>
                <div className="container">
                    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-main)" }}>
                            Browse by Category
                        </h2>
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                        gap: "1rem"
                    }}>
                        {categories.map((cat) => {
                            const IconComponent = cat.icon;
                            return (
                                <Link
                                    key={cat.name}
                                    to={`/events?category=${cat.name}`}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "0.75rem",
                                        padding: "1.5rem 1rem",
                                        borderRadius: "var(--radius-lg)",
                                        background: "var(--bg-main)",
                                        border: "1px solid var(--border-light)",
                                        textDecoration: "none",
                                        transition: "all var(--transition-normal)"
                                    }}
                                    className="card-hover"
                                >
                                    <div style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: "14px",
                                        backgroundColor: cat.bg,
                                        color: cat.color,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        <IconComponent size={24} />
                                    </div>
                                    <span style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-main)" }}>
                                        {cat.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* FEATURED EVENTS SECTION */}
            <section style={{ padding: "4.5rem 0", background: "var(--bg-main)" }}>
                <div className="container">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--primary)", fontWeight: 700, fontSize: "0.875rem", textTransform: "uppercase" }}>
                                <TrendingUp size={16} /> Top Experiences
                            </div>
                            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)", marginTop: "0.25rem" }}>
                                Trending & Upcoming Events
                            </h2>
                        </div>
                        <Link to="/events" className="btn btn-secondary">
                            View All Events <ArrowRight size={16} />
                        </Link>
                    </div>

                    {loading ? (
                        <Loader text="Loading featured events..." />
                    ) : featuredEvents.length === 0 ? (
                        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                            <p style={{ color: "var(--text-muted)" }}>No published events currently available.</p>
                        </div>
                    ) : (
                        <div className="grid-events">
                            {featuredEvents.map((event) => {
                                const startingPrice = event.ticketTypes?.length
                                    ? Math.min(...event.ticketTypes.map((t) => t.price))
                                    : 0;

                                return (
                                    <div key={event._id} className="card card-hover" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                                        {/* Thumbnail */}
                                        <div style={{ position: "relative", height: 200, width: "100%", overflow: "hidden", background: "#e2e8f0" }}>
                                            <img
                                                src={event.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80"}
                                                alt={event.title}
                                                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80"; }}
                                                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }}
                                            />
                                            <span style={{
                                                position: "absolute",
                                                top: "1rem",
                                                left: "1rem",
                                                background: "rgba(15, 23, 42, 0.8)",
                                                backdropFilter: "blur(6px)",
                                                color: "white",
                                                fontSize: "0.75rem",
                                                fontWeight: 700,
                                                padding: "0.25rem 0.625rem",
                                                borderRadius: "var(--radius-full)",
                                                textTransform: "uppercase"
                                            }}>
                                                {event.category}
                                            </span>

                                            <span style={{
                                                position: "absolute",
                                                bottom: "1rem",
                                                right: "1rem",
                                                background: "var(--primary)",
                                                color: "white",
                                                fontSize: "0.8125rem",
                                                fontWeight: 800,
                                                padding: "0.25rem 0.75rem",
                                                borderRadius: "var(--radius-md)",
                                                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)"
                                            }}>
                                                From ₹{startingPrice}
                                            </span>
                                        </div>

                                        {/* Card Body */}
                                        <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                                            <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.5rem", lineHeight: 1.4 }}>
                                                {event.title}
                                            </h3>
                                            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "1rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                                {event.description}
                                            </p>

                                            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "0.375rem", fontSize: "0.8125rem", color: "var(--text-muted)", paddingTop: "0.75rem", borderTop: "1px solid var(--border-light)" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                                    <Calendar size={14} color="var(--primary)" />
                                                    <span>{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} • {event.startTime}</span>
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                                    <MapPin size={14} color="var(--primary)" />
                                                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{event.venue}, {event.location}</span>
                                                </div>
                                            </div>

                                            <Link
                                                to={`/events/${event._id}`}
                                                className="btn btn-primary"
                                                style={{ width: "100%", marginTop: "1.25rem" }}
                                            >
                                                Book Tickets
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section style={{ padding: "5rem 0", background: "white" }}>
                <div className="container" style={{ textAlign: "center", maxWidth: 960 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "var(--primary)", fontWeight: 700, fontSize: "0.875rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                        <Sparkles size={16} /> Seamless Digital Experience
                    </div>
                    <h2 style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "3rem" }}>
                        How Eventix Works
                    </h2>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem", textAlign: "left" }}>
                        {/* Step 1 */}
                        <div className="card" style={{ padding: "2rem" }}>
                            <div style={{ width: 48, height: 48, borderRadius: "12px", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.25rem", marginBottom: "1.25rem" }}>
                                1
                            </div>
                            <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.5rem" }}>
                                Discover & Select
                            </h3>
                            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                                Explore hundreds of verified concerts, sports games, and conferences with real-time seat availability and tier pricing.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="card" style={{ padding: "2rem" }}>
                            <div style={{ width: 48, height: 48, borderRadius: "12px", background: "rgba(6, 182, 212, 0.1)", color: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.25rem", marginBottom: "1.25rem" }}>
                                2
                            </div>
                            <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.5rem" }}>
                                Instant QR E-Ticket
                            </h3>
                            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                                Checkout in seconds and receive your unique encrypted digital QR pass on your portal, ready to download or print.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="card" style={{ padding: "2rem" }}>
                            <div style={{ width: 48, height: 48, borderRadius: "12px", background: "var(--success-light)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.25rem", marginBottom: "1.25rem" }}>
                                3
                            </div>
                            <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.5rem" }}>
                                Fast Venue Entry
                            </h3>
                            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                                Present your QR pass at the entrance gate. Organizers scan and verify your pass in under 1 second without duplicate fraud.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ORGANIZER CALLOUT CTA */}
            <section style={{ padding: "4rem 0", background: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)", color: "white" }}>
                <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "2rem" }}>
                    <div style={{ maxWidth: 600 }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#a5b4fc", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Host Your Event
                        </span>
                        <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "white", margin: "0.375rem 0 0.75rem" }}>
                            Are You an Event Organizer?
                        </h2>
                        <p style={{ color: "#cbd5e1", fontSize: "1rem", lineHeight: 1.6 }}>
                            Publish your events, configure multi-tier ticketing, track real-time revenue analytics, and manage gate check-ins with our integrated QR scanner.
                        </p>
                    </div>

                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        <Link to="/organizer" className="btn btn-lg" style={{ background: "white", color: "var(--primary)" }}>
                            Organizer Hub
                        </Link>
                        <Link to="/organizer/events/create" className="btn btn-lg" style={{ background: "rgba(255, 255, 255, 0.15)", color: "white", border: "1px solid rgba(255, 255, 255, 0.3)" }}>
                            Create Event
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
