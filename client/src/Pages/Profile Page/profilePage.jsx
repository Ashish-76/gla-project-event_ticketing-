import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { User, Mail, Phone, Lock, Save, Shield, KeyRound, Sparkles, CheckCircle2 } from "lucide-react";
import Badge from "../../Components/UI/Badge";

const ProfilePage = () => {
    const { user, updateProfile, changePassword } = useAuth();

    const [profileData, setProfileData] = useState({
        name: user?.name || "",
        phone: user?.phone || "",
        profileImage: user?.profileImage || ""
    });
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileMsg, setProfileMsg] = useState("");

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordMsg, setPasswordMsg] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileSaving(true);
        setProfileMsg("");
        try {
            await updateProfile(profileData);
            setProfileMsg("Profile updated successfully!");
        } catch (err) {
            setProfileMsg(err.message || "Failed to update profile");
        } finally {
            setProfileSaving(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError("");
        setPasswordMsg("");

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("New passwords do not match");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError("Password must be at least 6 characters long");
            return;
        }

        setPasswordSaving(true);
        try {
            await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setPasswordMsg("Password changed successfully!");
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            setPasswordError(err.response?.data?.message || err.message || "Failed to change password");
        } finally {
            setPasswordSaving(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "5rem", maxWidth: 860 }}>
            {/* Header */}
            <div style={{ marginBottom: "2rem" }}>
                <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Account Settings
                </span>
                <h1 style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--text-main)", margin: "0.25rem 0 0.5rem" }}>
                    User Profile & Preferences
                </h1>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>
                    Manage your personal information, contact numbers, and security credentials.
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem", alignItems: "flex-start" }}>
                {/* Left: Profile Information */}
                <div className="card">
                    <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border-light)" }}>
                        <img
                            src={user?.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                            alt={user?.name}
                            style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--primary-light)" }}
                        />
                        <div>
                            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)" }}>
                                {user?.name}
                            </h3>
                            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{user?.email}</p>
                            <div style={{ marginTop: "0.375rem" }}>
                                <Badge status={user?.role}>{user?.role}</Badge>
                            </div>
                        </div>
                    </div>

                    {profileMsg && (
                        <div style={{ padding: "0.75rem 1rem", background: "var(--success-light)", color: "var(--success)", borderRadius: "var(--radius-md)", fontSize: "0.875rem", fontWeight: 600, marginBottom: "1.25rem" }}>
                            {profileMsg}
                        </div>
                    )}

                    <form onSubmit={handleProfileSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Email Address (Immutable)</label>
                            <input
                                type="email"
                                value={user?.email || ""}
                                disabled
                                className="form-input"
                                style={{ background: "var(--bg-subtle)", color: "var(--text-muted)", cursor: "not-allowed" }}
                            />
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Phone Number</label>
                            <input
                                type="text"
                                placeholder="+91 98765 43210"
                                value={profileData.phone}
                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Profile Image URL</label>
                            <input
                                type="url"
                                placeholder="https://images.unsplash.com/..."
                                value={profileData.profileImage}
                                onChange={(e) => setProfileData({ ...profileData, profileImage: e.target.value })}
                                className="form-input"
                            />
                        </div>

                        <button type="submit" disabled={profileSaving} className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
                            <Save size={16} />
                            {profileSaving ? "Saving..." : "Save Profile Details"}
                        </button>
                    </form>
                </div>

                {/* Right: Change Password */}
                <div className="card">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
                        <KeyRound size={20} color="var(--primary)" />
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)" }}>
                            Change Password
                        </h3>
                    </div>

                    {passwordMsg && (
                        <div style={{ padding: "0.75rem 1rem", background: "var(--success-light)", color: "var(--success)", borderRadius: "var(--radius-md)", fontSize: "0.875rem", fontWeight: 600, marginBottom: "1.25rem" }}>
                            {passwordMsg}
                        </div>
                    )}

                    {passwordError && (
                        <div style={{ padding: "0.75rem 1rem", background: "var(--danger-light)", color: "var(--danger)", borderRadius: "var(--radius-md)", fontSize: "0.875rem", fontWeight: 600, marginBottom: "1.25rem" }}>
                            {passwordError}
                        </div>
                    )}

                    <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Current Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                placeholder="Min 6 characters"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Confirm New Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                className="form-input"
                                required
                            />
                        </div>

                        <button type="submit" disabled={passwordSaving} className="btn btn-secondary" style={{ marginTop: "0.5rem" }}>
                            <Lock size={16} />
                            {passwordSaving ? "Updating Password..." : "Update Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
