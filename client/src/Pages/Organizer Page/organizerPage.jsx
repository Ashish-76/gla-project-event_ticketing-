import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, useAuth } from "../../context/AuthContext";
import { 
    Calendar, 
    Ticket, 
    DollarSign, 
    QrCode, 
    PlusCircle, 
    Users, 
    ArrowRight, 
    CheckCircle2,
    Eye,
    TrendingUp
} from "lucide-react";
import Loader from "../../Components/UI/Loader";
import StatCard from "../../Components/UI/StatCard";
import Badge from "../../Components/UI/Badge";

const OrganizerPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrganizerData = async () => {
            try {
                const [eventsRes, bookingsRes] = await Promise.all([
                    api.get("/events/my"),
                    api.get("/bookings/organizer")
                ]);

                if (eventsRes.data.success) {
                    setEvents(eventsRes.data.events || []);
                }
                if (bookingsRes.data.success) {
                    setBookings(bookingsRes.data.bookings || []);
                }
            } catch (err) {
                console.error("Organizer data fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrganizerData();
    }, []);

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: "5rem", textAlign: "center" }}>
                <Loader text="Loading your organizer dashboard..." />
            </div>
        );
    }

    // Calculations
    const totalEvents = events.length;
    const publishedEvents = events.filter((e) => e.status === "published").length;
    const totalTicketsSold = events.reduce((acc, e) => acc + (e.stats?.soldTickets || 0), 0);
    const totalRevenue = events.reduce((acc, e) => acc + (e.stats?.revenue || 0), 0);

    return (
        <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "5rem" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                    <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Organizer Control Center
                    </span>
                    <h1 style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--text-main)", margin: "0.25rem 0 0.25rem" }}>
                        Welcome back, {user?.name}
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>
                        Manage your published events, monitor ticket sales, and verify gate entry passes.
                    </p>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <Link to="/organizer/scanner" className="btn btn-secondary">
                        <QrCode size={18} color="var(--primary)" /> Venue QR Scanner
                    </Link>
                    <Link to="/organizer/events/create" className="btn btn-primary">
                        <PlusCircle size={18} /> Create New Event
                    </Link>
                </div>
            </div>

            {/* KPI Metric Cards */}
            <div className="grid-stats" style={{ marginBottom: "2.5rem" }}>
                <StatCard
                    title="Total Revenue"
                    value={`₹${totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    color="#10b981"
                />
                <StatCard
                    title="Tickets Sold"
                    value={totalTicketsSold}
                    icon={Ticket}
                    color="var(--primary)"
                />
                <StatCard
                    title="Active Events"
                    value={publishedEvents}
                    subtitle={`${totalEvents} total created`}
                    icon={Calendar}
                    color="#3b82f6"
                />
                <StatCard
                    title="Total Bookings"
                    value={bookings.length}
                    icon={Users}
                    color="#8b5cf6"
                />
            </div>

            {/* Quick Actions Bar */}
            <div className="card" style={{ marginBottom: "2.5rem", background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)", color: "white" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
                    <div>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "white", marginBottom: "0.375rem" }}>
                            Gate Security & Fast Entry Check-In
                        </h3>
                        <p style={{ color: "#cbd5e1", fontSize: "0.875rem", maxWidth: 520 }}>
                            Use your smartphone camera or barcode scanner at the venue entrance to scan digital QR tickets with instant anti-fraud check.
                        </p>
                    </div>
                    <Link to="/organizer/scanner" className="btn btn-lg" style={{ background: "white", color: "var(--primary)" }}>
                        <QrCode size={20} /> Open Gate Scanner
                    </Link>
                </div>
            </div>

            {/* Events Management Grid */}
            <div style={{ marginBottom: "3rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                    <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text-main)" }}>
                        Your Events ({events.length})
                    </h2>
                    <Link to="/organizer/events" className="btn btn-secondary btn-sm">
                        Manage All Events <ArrowRight size={14} />
                    </Link>
                </div>

                {events.length === 0 ? (
                    <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                        <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>You haven't created any events yet.</p>
                        <Link to="/organizer/events/create" className="btn btn-primary">
                            <PlusCircle size={16} /> Create Your First Event
                        </Link>
                    </div>
                ) : (
                    <div className="grid-events">
                        {events.slice(0, 3).map((event) => (
                            <div key={event._id} className="card card-hover" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                                <div style={{ position: "relative", height: 180, width: "100%", background: "#e2e8f0" }}>
                                    <img
                                        src={event.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80"}
                                        alt={event.title}
                                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80"; }}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                    <span style={{ position: "absolute", top: "0.75rem", right: "0.75rem" }}>
                                        <Badge status={event.status}>{event.status}</Badge>
                                    </span>
                                </div>

                                <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                                    <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.375rem" }}>
                                        {event.title}
                                    </h3>
                                    <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                                        {new Date(event.date).toLocaleDateString()} • {event.venue}
                                    </p>

                                    {/* Stats preview */}
                                    <div style={{ background: "var(--bg-main)", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", marginBottom: "1rem" }}>
                                        <div>
                                            <span style={{ color: "var(--text-muted)", display: "block" }}>Sold</span>
                                            <strong style={{ color: "var(--text-main)" }}>{event.stats?.soldTickets || 0} / {event.stats?.totalTickets || 0}</strong>
                                        </div>
                                        <div>
                                            <span style={{ color: "var(--text-muted)", display: "block" }}>Revenue</span>
                                            <strong style={{ color: "var(--success)" }}>₹{event.stats?.revenue || 0}</strong>
                                        </div>
                                        <div>
                                            <span style={{ color: "var(--text-muted)", display: "block" }}>Checked In</span>
                                            <strong style={{ color: "var(--primary)" }}>{event.stats?.checkedInTickets || 0}</strong>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: "auto", display: "flex", gap: "0.5rem" }}>
                                        <Link to={`/organizer/events/attendees/${event._id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                                            <Users size={14} /> Attendees
                                        </Link>
                                        <Link to={`/organizer/events/edit/${event._id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                                            Edit
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Ticket Sales Table */}
            <div>
                <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "1rem" }}>
                    Recent Ticket Orders ({bookings.length})
                </h2>

                <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                    <div className="table-container" style={{ border: "none" }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Booking Ref</th>
                                    <th>Event</th>
                                    <th>Attendee</th>
                                    <th>Tier & Qty</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Order Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                                            No ticket sales recorded yet.
                                        </td>
                                    </tr>
                                ) : (
                                    bookings.slice(0, 5).map((b) => (
                                        <tr key={b._id}>
                                            <td style={{ fontFamily: "monospace", fontWeight: 700 }}>{b.bookingReference}</td>
                                            <td>{b.event?.title || "Event"}</td>
                                            <td>
                                                <p style={{ fontWeight: 600 }}>{b.attendee?.name || "Attendee"}</p>
                                                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{b.attendee?.email}</p>
                                            </td>
                                            <td>{b.ticketTypeName} ({b.quantity}x)</td>
                                            <td style={{ fontWeight: 700, color: "var(--success)" }}>₹{b.totalAmount}</td>
                                            <td><Badge status={b.status}>{b.status}</Badge></td>
                                            <td style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{new Date(b.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizerPage;