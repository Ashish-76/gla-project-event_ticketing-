import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../context/AuthContext";
import { 
    Search, 
    Calendar, 
    MapPin, 
    Filter, 
    SlidersHorizontal, 
    ArrowUpDown, 
    Sparkles, 
    X,
    Clock,
    Tag
} from "lucide-react";
import Loader from "../../Components/UI/Loader";
import Badge from "../../Components/UI/Badge";

const EventsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);

    // Query states
    const searchParam = searchParams.get("search") || "";
    const categoryParam = searchParams.get("category") || "All";
    const locationParam = searchParams.get("location") || "All";
    const sortParam = searchParams.get("sort") || "date_asc";

    const [searchInput, setSearchInput] = useState(searchParam);
    const [selectedCategory, setSelectedCategory] = useState(categoryParam);
    const [selectedLocation, setSelectedLocation] = useState(locationParam);
    const [selectedSort, setSelectedSort] = useState(sortParam);

    // Fetch Metadata & Events
    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const res = await api.get("/events/meta");
                if (res.data.success) {
                    setCategories(["All", ...(res.data.categories || [])]);
                    setLocations(["All", ...(res.data.locations || [])]);
                }
            } catch (err) {
                console.error("Meta fetch error:", err);
            }
        };
        fetchMeta();
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [searchParams]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                status: "published",
                search: searchParams.get("search") || "",
                category: searchParams.get("category") || "",
                location: searchParams.get("location") || "",
                sort: searchParams.get("sort") || "date_asc"
            });

            const res = await api.get(`/events?${query.toString()}`);
            if (res.data.success) {
                setEvents(res.data.events || []);
            }
        } catch (err) {
            console.error("Events fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const updateFilter = (key, val) => {
        const newParams = new URLSearchParams(searchParams);
        if (val && val !== "All") {
            newParams.set(key, val);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        updateFilter("search", searchInput);
    };

    const resetFilters = () => {
        setSearchInput("");
        setSelectedCategory("All");
        setSelectedLocation("All");
        setSelectedSort("date_asc");
        setSearchParams({});
    };

    const hasActiveFilters = searchParam || categoryParam !== "All" || locationParam !== "All" || sortParam !== "date_asc";

    return (
        <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "5rem" }}>
            {/* Header Title */}
            <div style={{ marginBottom: "2rem" }}>
                <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Find Live Experiences
                </span>
                <h1 style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--text-main)", margin: "0.25rem 0 0.5rem" }}>
                    Explore All Events
                </h1>
                <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
                    Discover top concerts, conferences, art showcases, and sports matches.
                </p>
            </div>

            {/* Filter & Search Controls */}
            <div className="card" style={{ marginBottom: "2rem", padding: "1.5rem" }}>
                <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                    <div style={{ position: "relative", flex: "1 1 300px" }}>
                        <Search size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                        <input
                            type="text"
                            placeholder="Search by title, description, artist, venue..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="form-input"
                            style={{ paddingLeft: "2.75rem" }}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        <Search size={18} /> Search
                    </button>

                    {hasActiveFilters && (
                        <button type="button" onClick={resetFilters} className="btn btn-secondary">
                            <X size={16} /> Reset
                        </button>
                    )}
                </form>

                {/* Categories Pills */}
                <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.75rem", marginBottom: "1rem" }}>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                setSelectedCategory(cat);
                                updateFilter("category", cat);
                            }}
                            className={`btn btn-sm ${categoryParam === cat || (cat === "All" && !searchParams.get("category")) ? "btn-primary" : "btn-secondary"}`}
                            style={{ borderRadius: "var(--radius-full)" }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Secondary Filters: Location & Sort */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "1rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid var(--border-light)"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--text-muted)" }}>
                            <MapPin size={16} /> Location:
                        </div>
                        <select
                            value={locationParam}
                            onChange={(e) => {
                                setSelectedLocation(e.target.value);
                                updateFilter("location", e.target.value);
                            }}
                            className="form-select"
                            style={{ width: "auto", padding: "0.375rem 0.75rem", fontSize: "0.875rem" }}
                        >
                            {locations.map((loc) => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--text-muted)" }}>
                            <ArrowUpDown size={16} /> Sort by:
                        </div>
                        <select
                            value={sortParam}
                            onChange={(e) => {
                                setSelectedSort(e.target.value);
                                updateFilter("sort", e.target.value);
                            }}
                            className="form-select"
                            style={{ width: "auto", padding: "0.375rem 0.75rem", fontSize: "0.875rem" }}
                        >
                            <option value="date_asc">Event Date (Earliest First)</option>
                            <option value="date_desc">Event Date (Latest First)</option>
                            <option value="price_asc">Price (Low to High)</option>
                            <option value="price_desc">Price (High to Low)</option>
                            <option value="popular">Most Popular</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Event Cards Grid */}
            {loading ? (
                <div style={{ padding: "4rem 0", textAlign: "center" }}>
                    <Loader text="Searching available events..." />
                </div>
            ) : events.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
                    <div style={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        background: "var(--bg-subtle)",
                        color: "var(--text-muted)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "1rem"
                    }}>
                        <Search size={28} />
                    </div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.5rem" }}>
                        No events found
                    </h3>
                    <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", maxWidth: 450, margin: "0 auto 1.5rem" }}>
                        We couldn't find any events matching your search or filters. Try searching for a different keyword or resetting filters.
                    </p>
                    <button onClick={resetFilters} className="btn btn-primary">
                        Clear All Filters
                    </button>
                </div>
            ) : (
                <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                        <p style={{ fontSize: "0.9375rem", color: "var(--text-muted)", fontWeight: 600 }}>
                            Showing <strong style={{ color: "var(--text-main)" }}>{events.length}</strong> events
                        </p>
                    </div>

                    <div className="grid-events">
                        {events.map((event) => {
                            const startingPrice = event.ticketTypes?.length
                                ? Math.min(...event.ticketTypes.map((t) => t.price))
                                : 0;
                            const totalCapacity = event.ticketTypes?.reduce((acc, t) => acc + t.capacity, 0) || 0;
                            const totalSold = event.ticketTypes?.reduce((acc, t) => acc + t.sold, 0) || 0;
                            const isSoldOut = totalCapacity > 0 && totalSold >= totalCapacity;

                            return (
                                <div key={event._id} className="card card-hover" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                                    {/* Thumbnail Image */}
                                    <div style={{ position: "relative", height: 210, width: "100%", overflow: "hidden", background: "#e2e8f0" }}>
                                        <img
                                            src={event.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80"}
                                            alt={event.title}
                                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80"; }}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                        <span style={{
                                            position: "absolute",
                                            top: "1rem",
                                            left: "1rem",
                                            background: "rgba(15, 23, 42, 0.85)",
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
                                            background: isSoldOut ? "var(--danger)" : "var(--primary)",
                                            color: "white",
                                            fontSize: "0.8125rem",
                                            fontWeight: 800,
                                            padding: "0.25rem 0.75rem",
                                            borderRadius: "var(--radius-md)",
                                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)"
                                        }}>
                                            {isSoldOut ? "SOLD OUT" : `From ₹${startingPrice}`}
                                        </span>
                                    </div>

                                    {/* Body Details */}
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
                                                <span>{new Date(event.date).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                                <Clock size={14} color="var(--primary)" />
                                                <span>{event.startTime} - {event.endTime}</span>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                                <MapPin size={14} color="var(--primary)" />
                                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{event.venue}, {event.location}</span>
                                            </div>
                                        </div>

                                        <Link
                                            to={`/events/${event._id}`}
                                            className={`btn ${isSoldOut ? "btn-secondary" : "btn-primary"}`}
                                            style={{ width: "100%", marginTop: "1.25rem" }}
                                        >
                                            {isSoldOut ? "View Details (Sold Out)" : "Book Tickets"}
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default EventsPage;