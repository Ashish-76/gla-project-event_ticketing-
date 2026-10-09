import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../context/AuthContext";
import { 
    Bookmark, 
    Calendar, 
    Clock, 
    MapPin, 
    QrCode, 
    Ticket as TicketIcon, 
    AlertCircle, 
    XCircle,
    ArrowRight
} from "lucide-react";
import Loader from "../../Components/UI/Loader";
import Badge from "../../Components/UI/Badge";
import TicketModal from "../../Components/QR/TicketModal";

const MyBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterTab, setFilterTab] = useState("all");
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await api.get("/bookings/my");
            if (res.data.success) {
                setBookings(res.data.bookings || []);
            }
        } catch (err) {
            console.error("Failed to load bookings:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this booking? This will cancel all associated tickets and process a refund.");
        if (!confirmCancel) return;

        setCancelLoading(true);
        try {
            const res = await api.post(`/bookings/${bookingId}/cancel`);
            alert(res.data.message || "Booking cancelled successfully.");
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to cancel booking");
        } finally {
            setCancelLoading(false);
        }
    };

    const handleOpenTicketModal = (ticket, booking) => {
        setSelectedTicket(ticket);
        setSelectedBooking(booking);
        setModalOpen(true);
    };

    // Filter bookings by tab
    const filteredBookings = bookings.filter((b) => {
        if (filterTab === "confirmed") return b.status === "confirmed";
        if (filterTab === "cancelled") return b.status === "cancelled";
        return true;
    });

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: "5rem", textAlign: "center" }}>
                <Loader text="Loading your bookings and digital passes..." />
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "5rem" }}>
            {/* Page Header */}
            <div style={{ marginBottom: "2rem" }}>
                <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Attendee Hub
                </span>
                <h1 style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--text-main)", margin: "0.25rem 0 0.5rem" }}>
                    My Bookings & E-Tickets
                </h1>
                <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
                    Access your booked tickets, view QR entrance passes, and manage your registrations.
                </p>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.75rem" }}>
                <button
                    onClick={() => setFilterTab("all")}
                    className={`btn btn-sm ${filterTab === "all" ? "btn-primary" : "btn-secondary"}`}
                >
                    All Bookings ({bookings.length})
                </button>
                <button
                    onClick={() => setFilterTab("confirmed")}
                    className={`btn btn-sm ${filterTab === "confirmed" ? "btn-primary" : "btn-secondary"}`}
                >
                    Confirmed ({bookings.filter(b => b.status === "confirmed").length})
                </button>
                <button
                    onClick={() => setFilterTab("cancelled")}
                    className={`btn btn-sm ${filterTab === "cancelled" ? "btn-primary" : "btn-secondary"}`}
                >
                    Cancelled ({bookings.filter(b => b.status === "cancelled").length})
                </button>
            </div>

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
                    <div style={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        background: "var(--primary-light)",
                        color: "var(--primary)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "1rem"
                    }}>
                        <Bookmark size={28} />
                    </div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.5rem" }}>
                        No bookings found
                    </h3>
                    <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", maxWidth: 400, margin: "0 auto 1.5rem" }}>
                        You don't have any bookings in this section yet. Explore upcoming concerts, workshops, and sports matches!
                    </p>
                    <Link to="/events" className="btn btn-primary">
                        Browse Events <ArrowRight size={16} />
                    </Link>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {filteredBookings.map((booking) => {
                        const event = booking.event;
                        const isConfirmed = booking.status === "confirmed";

                        return (
                            <div
                                key={booking._id}
                                className="card"
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                                    gap: "1.5rem",
                                    alignItems: "center",
                                    padding: "1.5rem"
                                }}
                            >
                                {/* Event Info */}
                                <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
                                    <img
                                        src={event?.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=400&q=80"}
                                        alt={event?.title}
                                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=400&q=80"; }}
                                        style={{ width: 100, height: 100, borderRadius: "var(--radius-md)", objectFit: "cover", flexShrink: 0 }}
                                    />
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                                            <Badge status={booking.status}>{booking.status}</Badge>
                                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                                                {booking.bookingReference}
                                            </span>
                                        </div>
                                        <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.375rem" }}>
                                            {event?.title || "Event Unavailable"}
                                        </h3>
                                        <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                                            <span style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                                <Calendar size={14} color="var(--primary)" />
                                                {event?.date ? new Date(event.date).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : "—"}
                                            </span>
                                            <span style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                                <MapPin size={14} color="var(--primary)" />
                                                {event?.venue}, {event?.location}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Ticket Details & Pricing */}
                                <div>
                                    <div style={{ background: "var(--bg-main)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                                            <span style={{ color: "var(--text-muted)" }}>Ticket Tier</span>
                                            <strong style={{ color: "var(--text-main)" }}>{booking.ticketTypeName}</strong>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                                            <span style={{ color: "var(--text-muted)" }}>Quantity</span>
                                            <strong style={{ color: "var(--text-main)" }}>{booking.quantity} Pass(es)</strong>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1rem", fontWeight: 800, paddingTop: "0.5rem", borderTop: "1px solid var(--border-light)" }}>
                                            <span>Total Paid</span>
                                            <span style={{ color: "var(--primary)" }}>₹{booking.totalAmount}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions & QR Buttons */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                                    {isConfirmed && booking.tickets && booking.tickets.length > 0 ? (
                                        booking.tickets.map((t, idx) => (
                                            <button
                                                key={t._id}
                                                onClick={() => handleOpenTicketModal(t, booking)}
                                                className="btn btn-primary"
                                                style={{ width: "100%", justifyContent: "center" }}
                                            >
                                                <QrCode size={18} />
                                                View E-Ticket {booking.tickets.length > 1 ? `#${idx + 1}` : ""}
                                            </button>
                                        ))
                                    ) : isConfirmed ? (
                                        <button
                                            onClick={() => handleOpenTicketModal(null, booking)}
                                            className="btn btn-primary"
                                            style={{ width: "100%", justifyContent: "center" }}
                                        >
                                            <QrCode size={18} />
                                            View Digital Pass
                                        </button>
                                    ) : null}

                                    {isConfirmed && (
                                        <button
                                            onClick={() => handleCancelBooking(booking._id)}
                                            disabled={cancelLoading}
                                            className="btn btn-outline-danger btn-sm"
                                            style={{ width: "100%", justifyContent: "center" }}
                                        >
                                            <XCircle size={16} /> Cancel Booking & Refund
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Digital E-Ticket Modal */}
            <TicketModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                ticket={selectedTicket}
                booking={selectedBooking}
            />
        </div>
    );
};

export default MyBookingsPage;