import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../context/AuthContext";
import { 
    Calendar, 
    Clock, 
    MapPin, 
    Plus, 
    Trash2, 
    ArrowLeft, 
    Image as ImageIcon, 
    Tag, 
    Sparkles 
} from "lucide-react";

const CreateEvent = () => {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [event, setEvent] = useState({
        title: "",
        description: "",
        category: "Music",
        venue: "",
        location: "",
        date: "",
        startTime: "18:00",
        endTime: "22:00",
        image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80",
        status: "published"
    });

    const [ticketTypes, setTicketTypes] = useState([
        { name: "General Admission", price: 499, capacity: 200 }
    ]);

    const categories = ["Music", "Tech", "Sports", "Arts", "Workshops", "Travel", "Business", "Entertainment"];

    const handleChange = (e) => {
        setEvent({
            ...event,
            [e.target.name]: e.target.value
        });
    };

    const handleTicketChange = (index, field, value) => {
        const updated = [...ticketTypes];
        updated[index] = {
            ...updated[index],
            [field]: field === "price" || field === "capacity" ? Number(value) : value
        };
        setTicketTypes(updated);
    };

    const addTicketType = () => {
        setTicketTypes([
            ...ticketTypes,
            { name: "VIP Pass", price: 999, capacity: 50 }
        ]);
    };

    const removeTicketType = (index) => {
        if (ticketTypes.length === 1) {
            alert("At least one ticket type is required");
            return;
        }
        setTicketTypes(ticketTypes.filter((_, idx) => idx !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        if (!event.title || !event.venue || !event.location || !event.date) {
            setErrorMsg("Please fill in all required event details");
            return;
        }

        for (const t of ticketTypes) {
            if (!t.name.trim() || t.price < 0 || t.capacity < 1) {
                setErrorMsg("Each ticket tier must have a valid name, non-negative price, and capacity of at least 1");
                return;
            }
        }

        setSaving(true);
        try {
            const res = await api.post("/events", {
                ...event,
                ticketTypes
            });

            if (res.data.success) {
                alert("🎉 Event created successfully!");
                navigate("/organizer/events");
            }
        } catch (err) {
            console.error("Create event error:", err);
            setErrorMsg(err.response?.data?.message || "Failed to create event");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "5rem", maxWidth: 860 }}>
            {/* Header */}
            <div style={{ marginBottom: "2rem" }}>
                <button onClick={() => navigate("/organizer/events")} className="btn btn-secondary btn-sm" style={{ marginBottom: "0.75rem" }}>
                    <ArrowLeft size={16} /> Back to Events
                </button>
                <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>
                    Event Publisher
                </span>
                <h1 style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--text-main)", margin: "0.25rem 0 0.5rem" }}>
                    Create New Event
                </h1>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>
                    Fill in the details below to publish your event and start selling QR-secured tickets.
                </p>
            </div>

            {errorMsg && (
                <div style={{ padding: "1rem", background: "var(--danger-light)", color: "var(--danger)", borderRadius: "var(--radius-md)", fontWeight: 600, marginBottom: "1.5rem" }}>
                    {errorMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {/* 1. Basic Information */}
                <div className="card">
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "1.25rem" }}>
                        1. Event Details
                    </h2>

                    <div className="form-group">
                        <label className="form-label">Event Title *</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="e.g. Sunburn Electronic Music Carnival 2026"
                            value={event.title}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Category *</label>
                        <select
                            name="category"
                            value={event.category}
                            onChange={handleChange}
                            className="form-select"
                            required
                        >
                            {categories.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Event Description *</label>
                        <textarea
                            name="description"
                            placeholder="Provide details regarding the event schedule, lineup, age restrictions, and special instructions..."
                            value={event.description}
                            onChange={handleChange}
                            className="form-textarea"
                            rows={4}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Cover Image URL</label>
                        <input
                            type="url"
                            name="image"
                            placeholder="https://images.unsplash.com/..."
                            value={event.image}
                            onChange={handleChange}
                            className="form-input"
                        />
                        {event.image && (
                            <div style={{ marginTop: "0.75rem", height: 160, borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                                <img src={event.image} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Venue & Date Schedule */}
                <div className="card">
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "1.25rem" }}>
                        2. Date, Time & Venue
                    </h2>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div className="form-group">
                            <label className="form-label">Venue Name *</label>
                            <input
                                type="text"
                                name="venue"
                                placeholder="e.g. Royal Palace Auditorium"
                                value={event.venue}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">City / Location *</label>
                            <input
                                type="text"
                                name="location"
                                placeholder="e.g. New Delhi, Mumbai, Agra"
                                value={event.location}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                        <div className="form-group">
                            <label className="form-label">Event Date *</label>
                            <input
                                type="date"
                                name="date"
                                value={event.date}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Start Time *</label>
                            <input
                                type="time"
                                name="startTime"
                                value={event.startTime}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">End Time *</label>
                            <input
                                type="time"
                                name="endTime"
                                value={event.endTime}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Ticket Tiers Configuration */}
                <div className="card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)" }}>
                            3. Ticket Tiers & Pricing
                        </h2>
                        <button type="button" onClick={addTicketType} className="btn btn-secondary btn-sm">
                            <Plus size={16} /> Add Ticket Tier
                        </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {ticketTypes.map((t, idx) => (
                            <div key={idx} style={{ padding: "1.25rem", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", background: "var(--bg-main)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                                    <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--primary)" }}>
                                        Tier #{idx + 1}
                                    </span>
                                    {ticketTypes.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeTicketType(idx)}
                                            style={{ color: "var(--danger)", padding: "0.25rem", display: "flex", alignItems: "center" }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "1rem" }}>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label">Tier Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. General, VIP, Early Bird"
                                            value={t.name}
                                            onChange={(e) => handleTicketChange(idx, "name", e.target.value)}
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label">Price (₹)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="499"
                                            value={t.price}
                                            onChange={(e) => handleTicketChange(idx, "price", e.target.value)}
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label">Capacity</label>
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="100"
                                            value={t.capacity}
                                            onChange={(e) => handleTicketChange(idx, "capacity", e.target.value)}
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Publication Status & Submit */}
                <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <label className="form-label" style={{ margin: 0 }}>Status:</label>
                        <select
                            name="status"
                            value={event.status}
                            onChange={handleChange}
                            className="form-select"
                            style={{ width: "auto" }}
                        >
                            <option value="published">Published (Live for bookings)</option>
                            <option value="draft">Draft (Private)</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="btn btn-primary btn-lg"
                        style={{ padding: "0.75rem 2rem" }}
                    >
                        {saving ? "Publishing Event..." : "Create & Publish Event"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateEvent;