import React, { useEffect, useState } from "react";
import { api, useAuth } from "../../context/AuthContext";
import { 
    ShieldCheck, 
    Users, 
    Calendar, 
    DollarSign, 
    Bookmark, 
    Ticket, 
    Search, 
    Trash2, 
    CheckCircle2, 
    XCircle, 
    Activity, 
    Settings, 
    TrendingUp, 
    Shield, 
    ArrowUpDown,
    RefreshCw,
    Edit
} from "lucide-react";
import Loader from "../../Components/UI/Loader";
import StatCard from "../../Components/UI/StatCard";
import Badge from "../../Components/UI/Badge";

const AdminDashboard = () => {
    const { user: currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState("analytics");
    const [loading, setLoading] = useState(true);

    // Data States
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);
    const [platformSettings, setPlatformSettings] = useState([]);

    // Filter & Search states
    const [userSearch, setUserSearch] = useState("");
    const [userRoleFilter, setUserRoleFilter] = useState("all");
    const [eventSearch, setEventSearch] = useState("");
    const [bookingSearch, setBookingSearch] = useState("");

    // Settings form state
    const [settingsForm, setSettingsForm] = useState({
        site_name: "Eventix Global Ticketing",
        platform_fee_percent: 3.5,
        support_email: "support@eventix.com"
    });
    const [settingsSaving, setSettingsSaving] = useState(false);

    useEffect(() => {
        fetchAllAdminData();
    }, []);

    const fetchAllAdminData = async () => {
        setLoading(true);
        try {
            const [statsRes, usersRes, eventsRes, bookingsRes, logsRes, settingsRes] = await Promise.all([
                api.get("/admin/stats"),
                api.get("/admin/users"),
                api.get("/events?status=all"),
                api.get("/bookings/admin"),
                api.get("/admin/logs"),
                api.get("/admin/settings")
            ]);

            if (statsRes.data.success) setStats(statsRes.data.stats);
            if (usersRes.data.success) setUsers(usersRes.data.users || []);
            if (eventsRes.data.success) setEvents(eventsRes.data.events || []);
            if (bookingsRes.data.success) setBookings(bookingsRes.data.bookings || []);
            if (logsRes.data.success) setActivityLogs(logsRes.data.logs || []);
            if (settingsRes.data.success && settingsRes.data.settings) {
                setPlatformSettings(settingsRes.data.settings);
                const sObj = {};
                settingsRes.data.settings.forEach(s => { sObj[s.key] = s.value; });
                setSettingsForm(prev => ({ ...prev, ...sObj }));
            }
        } catch (err) {
            console.error("Admin data fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    // User Operations
    const handleStatusToggle = async (user) => {
        if (user._id === currentUser?.id || user._id === currentUser?._id) {
            alert("You cannot deactivate your own account");
            return;
        }
        try {
            await api.patch(`/admin/users/${user._id}/status`, { isActive: !user.isActive });
            fetchAllAdminData();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update user status");
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        if (userId === currentUser?.id || userId === currentUser?._id) {
            alert("You cannot change your own admin role");
            return;
        }
        try {
            await api.patch(`/admin/users/${userId}/role`, { role: newRole });
            fetchAllAdminData();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update role");
        }
    };

    const handleDeleteUser = async (user) => {
        if (user._id === currentUser?.id || user._id === currentUser?._id) {
            alert("You cannot delete your own account");
            return;
        }
        if (!window.confirm(`Are you sure you want to permanently delete user "${user.name}" (${user.email})?`)) return;

        try {
            await api.delete(`/admin/users/${user._id}`);
            fetchAllAdminData();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete user");
        }
    };

    // Event Operations
    const handleEventStatusChange = async (eventId, newStatus) => {
        try {
            await api.put(`/events/${eventId}`, { status: newStatus });
            fetchAllAdminData();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update event status");
        }
    };

    const handleDeleteEvent = async (eventId, title) => {
        if (!window.confirm(`Are you sure you want to permanently delete event "${title}"?`)) return;
        try {
            await api.delete(`/events/${eventId}`);
            fetchAllAdminData();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete event");
        }
    };

    // Settings Save
    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setSettingsSaving(true);
        try {
            await Promise.all([
                api.post("/admin/settings", { key: "site_name", value: settingsForm.site_name, description: "Site brand name" }),
                api.post("/admin/settings", { key: "platform_fee_percent", value: Number(settingsForm.platform_fee_percent), description: "Service fee percentage" }),
                api.post("/admin/settings", { key: "support_email", value: settingsForm.support_email, description: "Support contact email" })
            ]);
            alert("Settings saved successfully!");
            fetchAllAdminData();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to save settings");
        } finally {
            setSettingsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: "5rem", textAlign: "center" }}>
                <Loader text="Loading Admin Control Center..." />
            </div>
        );
    }

    // Filter Users
    const filteredUsers = users.filter((u) => {
        const matchesSearch = 
            u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.phone?.toLowerCase().includes(userSearch.toLowerCase());
        const matchesRole = userRoleFilter === "all" || u.role === userRoleFilter;
        return matchesSearch && matchesRole;
    });

    // Filter Events
    const filteredEvents = events.filter((e) =>
        e.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
        e.category.toLowerCase().includes(eventSearch.toLowerCase()) ||
        e.venue.toLowerCase().includes(eventSearch.toLowerCase())
    );

    // Filter Bookings
    const filteredBookings = bookings.filter((b) =>
        b.bookingReference.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.attendee?.name?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.event?.title?.toLowerCase().includes(bookingSearch.toLowerCase())
    );

    return (
        <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "5rem" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "var(--primary)", fontWeight: 700, fontSize: "0.8125rem", textTransform: "uppercase" }}>
                        <ShieldCheck size={16} /> Super Admin Control Suite
                    </div>
                    <h1 style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--text-main)", margin: "0.25rem 0" }}>
                        Admin Analytics & Management
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>
                        Global oversight of platform revenue, registered users, active events, and audit security logs.
                    </p>
                </div>

                <button onClick={fetchAllAdminData} className="btn btn-secondary btn-sm">
                    <RefreshCw size={16} /> Refresh Data
                </button>
            </div>

            {/* Admin Tabs */}
            <div style={{
                display: "flex",
                gap: "0.5rem",
                overflowX: "auto",
                borderBottom: "1px solid var(--border-light)",
                paddingBottom: "0.75rem",
                marginBottom: "2rem"
            }}>
                <button
                    onClick={() => setActiveTab("analytics")}
                    className={`btn btn-sm ${activeTab === "analytics" ? "btn-primary" : "btn-secondary"}`}
                >
                    <TrendingUp size={16} /> Overview & Analytics
                </button>
                <button
                    onClick={() => setActiveTab("users")}
                    className={`btn btn-sm ${activeTab === "users" ? "btn-primary" : "btn-secondary"}`}
                >
                    <Users size={16} /> Users ({users.length})
                </button>
                <button
                    onClick={() => setActiveTab("events")}
                    className={`btn btn-sm ${activeTab === "events" ? "btn-primary" : "btn-secondary"}`}
                >
                    <Calendar size={16} /> Events ({events.length})
                </button>
                <button
                    onClick={() => setActiveTab("bookings")}
                    className={`btn btn-sm ${activeTab === "bookings" ? "btn-primary" : "btn-secondary"}`}
                >
                    <Bookmark size={16} /> All Bookings ({bookings.length})
                </button>
                <button
                    onClick={() => setActiveTab("logs")}
                    className={`btn btn-sm ${activeTab === "logs" ? "btn-primary" : "btn-secondary"}`}
                >
                    <Activity size={16} /> Audit Logs ({activityLogs.length})
                </button>
                <button
                    onClick={() => setActiveTab("settings")}
                    className={`btn btn-sm ${activeTab === "settings" ? "btn-primary" : "btn-secondary"}`}
                >
                    <Settings size={16} /> Settings
                </button>
            </div>

            {/* TAB 1: ANALYTICS & OVERVIEW */}
            {activeTab === "analytics" && (
                <div>
                    {/* Top KPI Cards */}
                    <div className="grid-stats" style={{ marginBottom: "2.5rem" }}>
                        <StatCard
                            title="Total Platform Revenue"
                            value={`₹${(stats?.revenue?.total || 0).toLocaleString()}`}
                            icon={DollarSign}
                            color="#10b981"
                        />
                        <StatCard
                            title="Total Bookings"
                            value={stats?.bookings?.total || 0}
                            subtitle={`${stats?.bookings?.confirmed || 0} Confirmed`}
                            icon={Bookmark}
                            color="var(--primary)"
                        />
                        <StatCard
                            title="Total Events"
                            value={stats?.events?.total || 0}
                            subtitle={`${stats?.events?.published || 0} Published`}
                            icon={Calendar}
                            color="#3b82f6"
                        />
                        <StatCard
                            title="Total Users"
                            value={stats?.users?.total || 0}
                            subtitle={`${stats?.users?.organizers || 0} Organizers`}
                            icon={Users}
                            color="#8b5cf6"
                        />
                    </div>

                    {/* Category Breakdown & Recent Transactions */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
                        {/* Categories Card */}
                        <div className="card">
                            <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "1.25rem" }}>
                                Events by Category
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                {stats?.categoryStats?.map((cat) => (
                                    <div key={cat._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1rem", background: "var(--bg-main)", borderRadius: "var(--radius-md)" }}>
                                        <span style={{ fontWeight: 700, color: "var(--text-main)" }}>{cat._id || "Uncategorized"}</span>
                                        <Badge status="primary">{cat.count} Events</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Bookings Stream */}
                        <div className="card">
                            <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "1.25rem" }}>
                                Recent Booking Transactions
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                {stats?.recentBookings?.map((b) => (
                                    <div key={b._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1rem", background: "var(--bg-main)", borderRadius: "var(--radius-md)" }}>
                                        <div>
                                            <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-main)" }}>{b.event?.title}</p>
                                            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{b.attendee?.name} • {b.bookingReference}</p>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <p style={{ fontWeight: 800, color: "var(--success)", fontSize: "0.9375rem" }}>₹{b.totalAmount}</p>
                                            <Badge status={b.status}>{b.status}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: USER MANAGEMENT */}
            {activeTab === "users" && (
                <div>
                    {/* User Filters */}
                    <div className="card" style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                        <div style={{ position: "relative", flex: "1 1 300px" }}>
                            <Search size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                            <input
                                type="text"
                                placeholder="Search by user name, email, or phone..."
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                                className="form-input"
                                style={{ paddingLeft: "2.75rem" }}
                            />
                        </div>

                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            {["all", "attendee", "organizer", "admin"].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setUserRoleFilter(r)}
                                    className={`btn btn-sm ${userRoleFilter === r ? "btn-primary" : "btn-secondary"}`}
                                    style={{ textTransform: "capitalize" }}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                        <div className="table-container" style={{ border: "none" }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Change Role</th>
                                        <th>Status Action</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((u) => {
                                        const isSelf = u._id === currentUser?.id || u._id === currentUser?._id;
                                        return (
                                            <tr key={u._id}>
                                                <td>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                        <img
                                                            src={u.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                                                            alt={u.name}
                                                            style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
                                                        />
                                                        <div>
                                                            <p style={{ fontWeight: 700, color: "var(--text-main)" }}>
                                                                {u.name} {isSelf && <span style={{ color: "var(--primary)", fontSize: "0.75rem" }}>(You)</span>}
                                                            </p>
                                                            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{u.email} • {u.phone || "No phone"}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><Badge status={u.role}>{u.role}</Badge></td>
                                                <td><Badge status={u.isActive ? "active" : "inactive"}>{u.isActive ? "Active" : "Inactive"}</Badge></td>
                                                <td>
                                                    <select
                                                        value={u.role}
                                                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                                        disabled={isSelf}
                                                        className="form-select"
                                                        style={{ width: "auto", padding: "0.25rem 0.5rem", fontSize: "0.8125rem" }}
                                                    >
                                                        <option value="attendee">Attendee</option>
                                                        <option value="organizer">Organizer</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => handleStatusToggle(u)}
                                                        disabled={isSelf}
                                                        className={`btn btn-sm ${u.isActive ? "btn-outline-danger" : "btn-secondary"}`}
                                                    >
                                                        {u.isActive ? "Deactivate" : "Activate"}
                                                    </button>
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => handleDeleteUser(u)}
                                                        disabled={isSelf}
                                                        className="btn btn-outline-danger btn-sm"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: EVENT MODERATION */}
            {activeTab === "events" && (
                <div>
                    <div className="card" style={{ marginBottom: "1.5rem" }}>
                        <div style={{ position: "relative" }}>
                            <Search size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                            <input
                                type="text"
                                placeholder="Search events by title, venue, or category..."
                                value={eventSearch}
                                onChange={(e) => setEventSearch(e.target.value)}
                                className="form-input"
                                style={{ paddingLeft: "2.75rem" }}
                            />
                        </div>
                    </div>

                    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                        <div className="table-container" style={{ border: "none" }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Event</th>
                                        <th>Category</th>
                                        <th>Organizer</th>
                                        <th>Date & Venue</th>
                                        <th>Status</th>
                                        <th>Moderation Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEvents.map((e) => (
                                        <tr key={e._id}>
                                            <td style={{ fontWeight: 700, color: "var(--text-main)" }}>{e.title}</td>
                                            <td><span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{e.category}</span></td>
                                            <td>{e.organizer?.name || "Host"}</td>
                                            <td style={{ fontSize: "0.8125rem" }}>
                                                {new Date(e.date).toLocaleDateString()} • {e.venue}
                                            </td>
                                            <td><Badge status={e.status}>{e.status}</Badge></td>
                                            <td>
                                                <div style={{ display: "flex", gap: "0.375rem" }}>
                                                    {e.status !== "published" && (
                                                        <button onClick={() => handleEventStatusChange(e._id, "published")} className="btn btn-sm btn-primary">
                                                            Publish
                                                        </button>
                                                    )}
                                                    {e.status === "published" && (
                                                        <button onClick={() => handleEventStatusChange(e._id, "draft")} className="btn btn-sm btn-secondary">
                                                            Unpublish
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleDeleteEvent(e._id, e.title)} className="btn btn-sm btn-outline-danger">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 4: ALL BOOKINGS */}
            {activeTab === "bookings" && (
                <div>
                    <div className="card" style={{ marginBottom: "1.5rem" }}>
                        <div style={{ position: "relative" }}>
                            <Search size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                            <input
                                type="text"
                                placeholder="Search by reference, attendee name, or event title..."
                                value={bookingSearch}
                                onChange={(e) => setBookingSearch(e.target.value)}
                                className="form-input"
                                style={{ paddingLeft: "2.75rem" }}
                            />
                        </div>
                    </div>

                    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                        <div className="table-container" style={{ border: "none" }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Ref Code</th>
                                        <th>Attendee</th>
                                        <th>Event</th>
                                        <th>Tier & Qty</th>
                                        <th>Total Paid</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBookings.map((b) => (
                                        <tr key={b._id}>
                                            <td style={{ fontFamily: "monospace", fontWeight: 700 }}>{b.bookingReference}</td>
                                            <td>
                                                <p style={{ fontWeight: 600 }}>{b.attendee?.name || "Attendee"}</p>
                                                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{b.attendee?.email}</p>
                                            </td>
                                            <td>{b.event?.title || "Event Unavailable"}</td>
                                            <td>{b.ticketTypeName} ({b.quantity}x)</td>
                                            <td style={{ fontWeight: 800, color: "var(--success)" }}>₹{b.totalAmount}</td>
                                            <td><Badge status={b.status}>{b.status}</Badge></td>
                                            <td style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{new Date(b.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 5: AUDIT LOGS */}
            {activeTab === "logs" && (
                <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                    <div className="table-container" style={{ border: "none" }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>User</th>
                                    <th>Action</th>
                                    <th>Category</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activityLogs.map((log) => (
                                    <tr key={log._id}>
                                        <td style={{ fontSize: "0.8125rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                                            {new Date(log.createdAt).toLocaleString()}
                                        </td>
                                        <td style={{ fontWeight: 600 }}>
                                            {log.user?.name || "System"} <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>({log.user?.role || "auto"})</span>
                                        </td>
                                        <td>
                                            <span style={{ fontFamily: "monospace", fontSize: "0.8125rem", background: "var(--bg-subtle)", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td><Badge status="neutral">{log.category}</Badge></td>
                                        <td style={{ fontSize: "0.875rem" }}>{log.details}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB 6: PLATFORM SETTINGS */}
            {activeTab === "settings" && (
                <div className="card" style={{ maxWidth: 650 }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "1.25rem" }}>
                        Global Platform Configuration
                    </h3>

                    <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Platform Brand Name</label>
                            <input
                                type="text"
                                value={settingsForm.site_name}
                                onChange={(e) => setSettingsForm({ ...settingsForm, site_name: e.target.value })}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Platform Convenience Fee (%)</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="20"
                                value={settingsForm.platform_fee_percent}
                                onChange={(e) => setSettingsForm({ ...settingsForm, platform_fee_percent: e.target.value })}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Official Support Contact Email</label>
                            <input
                                type="email"
                                value={settingsForm.support_email}
                                onChange={(e) => setSettingsForm({ ...settingsForm, support_email: e.target.value })}
                                className="form-input"
                                required
                            />
                        </div>

                        <button type="submit" disabled={settingsSaving} className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
                            {settingsSaving ? "Saving Settings..." : "Save Platform Configurations"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;