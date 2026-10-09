import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../context/AuthContext";
import { 
    Users, 
    Search, 
    ArrowLeft, 
    CheckCircle2, 
    Clock, 
    Download, 
    UserCheck, 
    Calendar, 
    MapPin 
} from "lucide-react";
import Loader from "../../Components/UI/Loader";
import Badge from "../../Components/UI/Badge";
import StatCard from "../../Components/UI/StatCard";

const EventAttendees = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [attendees, setAttendees] = useState([]);
    const [event, setEvent] = useState(null);
    const [stats, setStats] = useState({ totalTickets: 0, checkedInCount: 0, activeCount: 0 });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchAttendees();
    }, [id]);

    const fetchAttendees = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/tickets/event/${id}/attendees`);
            if (res.data.success) {
                setAttendees(res.data.attendees || []);
                setEvent(res.data.event);
                setStats(res.data.stats || { totalTickets: 0, checkedInCount: 0, activeCount: 0 });
            }
        } catch (error) {
            console.error("Failed to fetch attendees:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleManualCheckIn = async (ticketCode) => {
        setActionLoading(true);
        try {
            await api.post("/tickets/checkin", { ticketCode });
            fetchAttendees();
        } catch (error) {
            alert(error.response?.data?.message || "Check-in failed");
        } finally {
            setActionLoading(false);
        }
    };

    // Filter attendees
    const filteredAttendees = attendees.filter((t) => {
        const matchesSearch = 
            t.attendee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.attendee?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.ticketCode?.toLowerCase().includes(searchTerm.toLowerCase());

        if (filterStatus === "used") return matchesSearch && t.status === "used";
        if (filterStatus === "active") return matchesSearch && t.status === "active";
        return matchesSearch;
    });

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: "4rem", textAlign: "center" }}>
                <Loader text="Loading attendee check-in roster..." />
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
            {/* Top Bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                <button onClick={() => navigate("/organizer/events")} className="btn btn-secondary btn-sm">
                    <ArrowLeft size={16} /> Back to My Events
                </button>
                <button onClick={() => navigate("/organizer/scanner")} className="btn btn-primary btn-sm">
                    Open Live QR Scanner
                </button>
            </div>

            {/* Event Title Banner */}
            <div className="card" style={{ marginBottom: "2rem", background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)", color: "white" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#818cf8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Attendee Management Roster
                </span>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "white", margin: "0.25rem 0 0.75rem" }}>
                    {event?.title}
                </h1>
                <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.875rem", color: "#cbd5e1" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                        <Calendar size={16} color="#818cf8" />
                        {event?.date ? new Date(event.date).toLocaleDateString() : ""}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                        <MapPin size={16} color="#818cf8" />
                        {event?.venue}
                    </span>
                </div>
            </div>

            {/* KPI Stat Cards */}
            <div className="grid-stats" style={{ marginBottom: "2rem" }}>
                <StatCard
                    title="Total Tickets Issued"
                    value={stats.totalTickets}
                    icon={Users}
                    color="var(--primary)"
                />
                <StatCard
                    title="Checked In Attendees"
                    value={stats.checkedInCount}
                    subtitle={`${stats.totalTickets ? Math.round((stats.checkedInCount / stats.totalTickets) * 100) : 0}% Attendance`}
                    icon={CheckCircle2}
                    color="var(--success)"
                />
                <StatCard
                    title="Pending Check-in"
                    value={stats.activeCount}
                    icon={Clock}
                    color="var(--warning)"
                />
            </div>

            {/* Search & Filters */}
            <div className="card" style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div style={{ position: "relative", flex: "1 1 300px" }}>
                    <Search size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                        type="text"
                        placeholder="Search attendee by name, email, or ticket code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: "2.75rem" }}
                    />
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                        onClick={() => setFilterStatus("all")}
                        className={`btn btn-sm ${filterStatus === "all" ? "btn-primary" : "btn-secondary"}`}
                    >
                        All ({attendees.length})
                    </button>
                    <button
                        onClick={() => setFilterStatus("used")}
                        className={`btn btn-sm ${filterStatus === "used" ? "btn-primary" : "btn-secondary"}`}
                    >
                        Checked In ({stats.checkedInCount})
                    </button>
                    <button
                        onClick={() => setFilterStatus("active")}
                        className={`btn btn-sm ${filterStatus === "active" ? "btn-primary" : "btn-secondary"}`}
                    >
                        Pending ({stats.activeCount})
                    </button>
                </div>
            </div>

            {/* Attendees Table */}
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div className="table-container" style={{ border: "none" }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Attendee</th>
                                <th>Tier</th>
                                <th>Ticket Code</th>
                                <th>Booking Ref</th>
                                <th>Status</th>
                                <th>Checked In Time</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAttendees.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                                        No attendees found matching current criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredAttendees.map((t) => (
                                    <tr key={t._id}>
                                        <td>
                                            <p style={{ fontWeight: 700, color: "var(--text-main)" }}>
                                                {t.attendee?.name || "Guest"}
                                            </p>
                                            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                                {t.attendee?.email} • {t.attendee?.phone || "No phone"}
                                            </p>
                                        </td>
                                        <td>
                                            <span style={{ fontWeight: 600 }}>{t.ticketTypeName}</span>
                                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>₹{t.unitPrice}</span>
                                        </td>
                                        <td>
                                            <span style={{ fontFamily: "monospace", fontSize: "0.8125rem", background: "var(--bg-subtle)", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>
                                                {t.ticketCode}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                                            {t.booking?.bookingReference || "—"}
                                        </td>
                                        <td>
                                            <Badge status={t.status}>{t.status}</Badge>
                                        </td>
                                        <td style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                                            {t.checkedInAt ? new Date(t.checkedInAt).toLocaleString() : "—"}
                                        </td>
                                        <td>
                                            {t.status === "active" ? (
                                                <button
                                                    onClick={() => handleManualCheckIn(t.ticketCode)}
                                                    disabled={actionLoading}
                                                    className="btn btn-sm btn-primary"
                                                    style={{ background: "var(--success)" }}
                                                >
                                                    <UserCheck size={14} /> Check In
                                                </button>
                                            ) : (
                                                <span style={{ fontSize: "0.8125rem", color: "var(--success)", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                                    <CheckCircle2 size={14} /> Verified
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EventAttendees;
