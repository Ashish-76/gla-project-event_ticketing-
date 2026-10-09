import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../context/AuthContext";
import { 
    Calendar, 
    PlusCircle, 
    Edit, 
    Trash2, 
    Users, 
    Eye, 
    CheckCircle, 
    XCircle, 
    Search,
    ArrowLeft,
    Clock,
    MapPin,
    AlertCircle
} from "lucide-react";
import Loader from "../../Components/UI/Loader";
import Badge from "../../Components/UI/Badge";

const ManageEvents = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const fetchMyEvents = async () => {
        setLoading(true);
        try {
            const res = await api.get("/events/my");
            if (res.data.success) {
                setEvents(res.data.events || []);
            }
        } catch (err) {
            console.error("Failed to load events:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (eventId, currentStatus) => {
        const newStatus = currentStatus === "published" ? "draft" : "published";
        setActionLoading(true);
        try {
            await api.put(`/events/${eventId}`, { status: newStatus });
            fetchMyEvents();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update status");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteEvent = async (eventId, title) => {
        const confirmDelete = window.confirm(`Are you sure you want to permanently delete "${title}"?`);
        if (!confirmDelete) return;

        setActionLoading(true);
        try {
            await api.delete(`/events/${eventId}`);
            fetchMyEvents();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete event");
        } finally {
            setActionLoading(false);
        }
    };

    // Filter events
    const filteredEvents = events.filter((e) => {
        const matchesSearch = 
            e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.location.toLowerCase().includes(searchTerm.toLowerCase());

        if (statusFilter !== "all") {
            return matchesSearch && e.status === statusFilter;
        }
        return matchesSearch;
    });

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: "5rem", textAlign: "center" }}>
                <Loader text="Loading your events..." />
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "5rem" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <button onClick={() => navigate("/organizer")} className="btn btn-secondary btn-sm">
                            <ArrowLeft size={16} /> Back to Dashboard
                        </button>
                    </div>
                    <h1 style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--text-main)", margin: "0.5rem 0 0.25rem" }}>
                        Manage Events
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>
                        View, edit, publish, and track attendance for all your events.
                    </p>
                </div>

                <Link to="/organizer/events/create" className="btn btn-primary">
                    <PlusCircle size={18} /> Create New Event
                </Link>
            </div>

            {/* Filter Bar */}
            <div className="card" style={{ marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div style={{ position: "relative", flex: "1 1 300px" }}>
                    <Search size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                        type="text"
                        placeholder="Search your events by title or venue..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: "2.75rem" }}
                    />
                </div>

                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <button
                        onClick={() => setStatusFilter("all")}
                        className={`btn btn-sm ${statusFilter === "all" ? "btn-primary" : "btn-secondary"}`}
                    >
                        All ({events.length})
                    </button>
                    <button
                        onClick={() => setStatusFilter("published")}
                        className={`btn btn-sm ${statusFilter === "published" ? "btn-primary" : "btn-secondary"}`}
                    >
                        Published ({events.filter(e => e.status === "published").length})
                    </button>
                    <button
                        onClick={() => setStatusFilter("draft")}
                        className={`btn btn-sm ${statusFilter === "draft" ? "btn-primary" : "btn-secondary"}`}
                    >
                        Drafts ({events.filter(e => e.status === "draft").length})
                    </button>
                </div>
            </div>

            {/* Events List */}
            {filteredEvents.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
                    <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>No events found matching your filter criteria.</p>
                    <Link to="/organizer/events/create" className="btn btn-primary">
                        <PlusCircle size={16} /> Create an Event
                    </Link>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {filteredEvents.map((event) => {
                        const isPublished = event.status === "published";
                        const sold = event.stats?.soldTickets || 0;
                        const totalCap = event.stats?.totalTickets || 0;
                        const rev = event.stats?.revenue || 0;
                        const checkedIn = event.stats?.checkedInTickets || 0;

                        return (
                            <div
                                key={event._id}
                                className="card"
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                                    gap: "1.5rem",
                                    alignItems: "center",
                                    padding: "1.5rem"
                                }}
                            >
                                {/* Event Title & Image */}
                                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                                    <img
                                        src={event.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=400&q=80"}
                                        alt={event.title}
                                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=400&q=80"; }}
                                        style={{ width: 90, height: 90, borderRadius: "var(--radius-md)", objectFit: "cover", flexShrink: 0 }}
                                    />
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                                            <Badge status={event.status}>{event.status}</Badge>
                                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
                                                {event.category}
                                            </span>
                                        </div>
                                        <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.25rem" }}>
                                            {event.title}
                                        </h3>
                                        <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                                            <span>{new Date(event.date).toLocaleDateString()} • {event.startTime}</span>
                                            <span style={{ display: "block" }}>{event.venue}, {event.location}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Sales & Attendance Stats */}
                                <div>
                                    <div style={{ background: "var(--bg-main)", padding: "0.875rem 1rem", borderRadius: "var(--radius-md)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", textAlign: "center" }}>
                                        <div>
                                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Sold</span>
                                            <strong style={{ display: "block", fontSize: "0.9375rem", color: "var(--text-main)" }}>{sold} / {totalCap}</strong>
                                        </div>
                                        <div>
                                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Revenue</span>
                                            <strong style={{ display: "block", fontSize: "0.9375rem", color: "var(--success)" }}>₹{rev}</strong>
                                        </div>
                                        <div>
                                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Checked In</span>
                                            <strong style={{ display: "block", fontSize: "0.9375rem", color: "var(--primary)" }}>{checkedIn}</strong>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
                                    <Link to={`/organizer/events/attendees/${event._id}`} className="btn btn-secondary btn-sm">
                                        <Users size={16} /> Attendees ({sold})
                                    </Link>

                                    <Link to={`/organizer/events/edit/${event._id}`} className="btn btn-secondary btn-sm">
                                        <Edit size={16} /> Edit
                                    </Link>

                                    <button
                                        onClick={() => handleToggleStatus(event._id, event.status)}
                                        disabled={actionLoading}
                                        className={`btn btn-sm ${isPublished ? "btn-secondary" : "btn-primary"}`}
                                    >
                                        {isPublished ? "Unpublish (Draft)" : "Publish Event"}
                                    </button>

                                    <button
                                        onClick={() => handleDeleteEvent(event._id, event.title)}
                                        disabled={actionLoading}
                                        className="btn btn-outline-danger btn-sm"
                                        title="Delete Event"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ManageEvents;