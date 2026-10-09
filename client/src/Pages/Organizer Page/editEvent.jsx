import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../context/AuthContext";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Loader from "../../Components/UI/Loader";

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [event, setEvent] = useState({
        title: "",
        description: "",
        category: "",
        venue: "",
        location: "",
        date: "",
        startTime: "",
        endTime: "",
        image: "",
        status: "draft",
        ticketTypes: []
    });

    const categories = ["Music", "Tech", "Sports", "Arts", "Workshops", "Travel", "Business", "Entertainment"];

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/events/${id}`);
                if (res.data.success) {
                    const data = res.data.event;
                    setEvent({
                        title: data.title,
                        description: data.description,
                        category: data.category,
                        venue: data.venue,
                        location: data.location,
                        date: data.date ? data.date.substring(0, 10) : "",
                        startTime: data.startTime,
                        endTime: data.endTime,
                        image: data.image || "",
                        status: data.status,
                        ticketTypes: data.ticketTypes || []
                    });
                }
            } catch (err) {
                console.error("Failed to load event for edit:", err);
                setErrorMsg("Failed to load event details");
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleChange = (e) => {
        setEvent({
            ...event,
            [e.target.name]: e.target.value
        });
    };

    const handleTicketChange = (index, field, value) => {
        const updated = [...event.ticketTypes];
        updated[index] = {
            ...updated[index],
            [field]: field === "price" || field === "capacity" ? Number(value) : value
        };
        setEvent({ ...event, ticketTypes: updated });
    };

    const addTicketType = () => {
        setEvent({
            ...event,
            ticketTypes: [
                ...event.ticketTypes,
                { name: "New Tier", price: 499, capacity: 50, sold: 0 }
            ]
        });
    };

    const removeTicketType = (index) => {
        if (event.ticketTypes.length === 1) {
            alert("At least one ticket type is required");
            return;
        }
        const tier = event.ticketTypes[index];
        if (tier.sold > 0) {
            alert(`Cannot delete this tier because ${tier.sold} tickets have already been sold.`);
            return;
        }
        setEvent({
            ...event,
            ticketTypes: event.ticketTypes.filter((_, idx) => idx !== index)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErrorMsg("");

        try {
            const res = await api.put(`/events/${id}`, event);
            if (res.data.success) {
                alert("Event updated successfully!");
                navigate("/organizer/events");
            }
        } catch (err) {
            console.error("Update error:", err);
            setErrorMsg(err.response?.data?.message || "Failed to update event");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: "5rem", textAlign: "center" }}>
                <Loader text="Loading event details..." />
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "5rem", maxWidth: 860 }}>
            {/* Header */}
            <div style={{ marginBottom: "2rem" }}>
                <button onClick={() => navigate("/organizer/events")} className="btn btn-secondary btn-sm" style={{ marginBottom: "0.75rem" }}>
                    <ArrowLeft size={16} /> Back to Events
                </button>
                <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>
                    Event Editor
                </span>
                <h1 style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--text-main)", margin: "0.25rem 0 0.5rem" }}>
                    Edit Event: {event.title}
                </h1>
            </div>

            {errorMsg && (
                <div style={{ padding: "1rem", background: "var(--danger-light)", color: "var(--danger)", borderRadius: "var(--radius-md)", fontWeight: 600, marginBottom: "1.5rem" }}>
                    {errorMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {/* 1. Basic Info */}
                <div className="card">
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "1.25rem" }}>
                        1. Event Details
                    </h2>

                    <div className="form-group">
                        <label className="form-label">Event Title *</label>
                        <input
                            type="text"
                            name="title"
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
                        <label className="form-label">Description *</label>
                        <textarea
                            name="description"
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

                {/* 2. Venue & Date */}
                <div className="card">
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "1.25rem" }}>
                        2. Date, Time & Venue
                    </h2>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div className="form-group">
                            <label className="form-label">Venue *</label>
                            <input
                                type="text"
                                name="venue"
                                value={event.venue}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Location / City *</label>
                            <input
                                type="text"
                                name="location"
                                value={event.location}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                        <div className="form-group">
                            <label className="form-label">Date *</label>
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

                {/* 3. Ticket Tiers */}
                <div className="card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)" }}>
                            3. Ticket Tiers & Capacity
                        </h2>
                        <button type="button" onClick={addTicketType} className="btn btn-secondary btn-sm">
                            <Plus size={16} /> Add Ticket Tier
                        </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {event.ticketTypes.map((t, idx) => (
                            <div key={t._id || idx} style={{ padding: "1.25rem", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", background: "var(--bg-main)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                                    <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--primary)" }}>
                                        Tier #{idx + 1} {t.sold > 0 && `(${t.sold} sold)`}
                                    </span>
                                    {event.ticketTypes.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeTicketType(idx)}
                                            style={{ color: "var(--danger)", padding: "0.25rem" }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "1rem" }}>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
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
                                            value={t.price}
                                            onChange={(e) => handleTicketChange(idx, "price", e.target.value)}
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label">Capacity (Min {t.sold || 1})</label>
                                        <input
                                            type="number"
                                            min={t.sold || 1}
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

                {/* 4. Status & Submit */}
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
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button type="button" onClick={() => navigate("/organizer/events")} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving} className="btn btn-primary">
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditEvent;