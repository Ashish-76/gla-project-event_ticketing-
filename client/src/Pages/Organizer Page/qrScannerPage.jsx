import React, { useState, useEffect, useRef } from "react";
import { api } from "../../context/AuthContext";
import { 
    QrCode, 
    Search, 
    CheckCircle2, 
    AlertCircle, 
    XCircle, 
    UserCheck, 
    Calendar, 
    MapPin, 
    User, 
    Clock, 
    ArrowLeft,
    RefreshCw,
    Camera
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Badge from "../../Components/UI/Badge";

const QRScannerPage = () => {
    const navigate = useNavigate();
    const [ticketCodeInput, setTicketCodeInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [recentScans, setRecentScans] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");
    const [scannerActive, setScannerActive] = useState(false);
    const scannerRef = useRef(null);

    // Initialize HTML5 QR Code Scanner if active
    useEffect(() => {
        let html5QrCode = null;

        if (scannerActive) {
            import("html5-qrcode").then(({ Html5Qrcode }) => {
                html5QrCode = new Html5Qrcode("qr-reader");
                scannerRef.current = html5QrCode;

                html5QrCode.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 }
                    },
                    (decodedText) => {
                        // Successfully scanned
                        handleVerify(decodedText);
                        setScannerActive(false);
                        html5QrCode.stop().catch(console.error);
                    },
                    (errorMessage) => {
                        // Scanning frame, no QR detected yet
                    }
                ).catch((err) => {
                    console.error("Camera access error:", err);
                    setErrorMsg("Camera access failed or permission denied. Please enter ticket code manually.");
                    setScannerActive(false);
                });
            });
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(console.error);
            }
        };
    }, [scannerActive]);

    const handleVerify = async (codeToVerify) => {
        const code = codeToVerify || ticketCodeInput;
        if (!code || !code.trim()) {
            setErrorMsg("Please enter or scan a ticket code");
            return;
        }

        setLoading(true);
        setErrorMsg("");
        setResult(null);

        try {
            const response = await api.post("/tickets/verify", {
                ticketCode: code.trim()
            });

            const data = response.data;
            setResult(data);

            // Add to session scan history
            if (data.ticket) {
                setRecentScans((prev) => [
                    {
                        code: data.ticket.ticketCode,
                        attendee: data.ticket.attendee?.name,
                        status: data.status,
                        time: new Date().toLocaleTimeString()
                    },
                    ...prev.slice(0, 9)
                ]);
            }

        } catch (error) {
            console.error("Verification error:", error);
            const errData = error.response?.data;
            setResult({
                isValid: false,
                status: errData?.status || "invalid",
                message: errData?.message || "Invalid ticket code or check-in error"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        if (!result?.ticket?.ticketCode) return;

        setLoading(true);
        try {
            const response = await api.post("/tickets/checkin", {
                ticketCode: result.ticket.ticketCode
            });

            setResult({
                ...result,
                isValid: false,
                status: "already_used",
                message: "Attendee successfully checked in!",
                ticket: response.data.ticket
            });

            // Update recent scans
            setRecentScans((prev) =>
                prev.map((scan) =>
                    scan.code === result.ticket.ticketCode
                        ? { ...scan, status: "checked_in" }
                        : scan
                )
            );
        } catch (error) {
            console.error("Check-in error:", error);
            setErrorMsg(error.response?.data?.message || "Check-in failed");
        } finally {
            setLoading(false);
        }
    };

    const resetLookup = () => {
        setTicketCodeInput("");
        setResult(null);
        setErrorMsg("");
    };

    return (
        <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem", maxWidth: 900 }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
                <button onClick={() => navigate("/organizer")} className="btn btn-secondary btn-sm">
                    <ArrowLeft size={16} /> Back to Organizer Hub
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Badge status="active">Live Venue Scanner</Badge>
                </div>
            </div>

            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: "16px",
                    background: "var(--primary-light)",
                    color: "var(--primary)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem"
                }}>
                    <QrCode size={32} />
                </div>
                <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.5rem" }}>
                    Venue Gate Entry Verification
                </h1>
                <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
                    Scan attendee QR codes or enter ticket codes manually to verify validity and grant instant entry.
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
                {/* Input & Scanner Controls */}
                <div className="card" style={{ padding: "2rem" }}>
                    {/* Camera Scanner Container */}
                    {scannerActive ? (
                        <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                            <div id="qr-reader" style={{ width: "100%", maxWidth: 400, margin: "0 auto", borderRadius: "12px", overflow: "hidden" }}></div>
                            <button
                                onClick={() => setScannerActive(false)}
                                className="btn btn-secondary btn-sm"
                                style={{ marginTop: "1rem" }}
                            >
                                Stop Camera
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
                            <button
                                onClick={() => setScannerActive(true)}
                                className="btn btn-primary btn-lg"
                                style={{ width: "100%", maxWidth: 360, gap: "0.75rem" }}
                            >
                                <Camera size={22} />
                                Launch Camera Scanner
                            </button>
                        </div>
                    )}

                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.5rem 0" }}>
                        <div style={{ flex: 1, borderTop: "1px solid var(--border-light)" }} />
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                            Or Enter Ticket Code
                        </span>
                        <div style={{ flex: 1, borderTop: "1px solid var(--border-light)" }} />
                    </div>

                    {/* Manual Code Input Form */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleVerify();
                        }}
                        style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
                    >
                        <input
                            type="text"
                            placeholder="e.g. TKT-BK-DEMO-2026-9042-1-101"
                            value={ticketCodeInput}
                            onChange={(e) => setTicketCodeInput(e.target.value)}
                            className="form-input"
                            style={{ flex: "1 1 250px", fontSize: "1rem", textTransform: "uppercase", fontFamily: "monospace" }}
                            required
                        />
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <RefreshCw size={18} className="animate-spin" /> : <Search size={18} />}
                            Verify Code
                        </button>
                        {result && (
                            <button type="button" onClick={resetLookup} className="btn btn-secondary">
                                Clear
                            </button>
                        )}
                    </form>

                    {errorMsg && (
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginTop: "1rem",
                            padding: "0.75rem 1rem",
                            background: "var(--danger-light)",
                            color: "var(--danger)",
                            borderRadius: "var(--radius-md)",
                            fontSize: "0.875rem",
                            fontWeight: 600
                        }}>
                            <AlertCircle size={18} />
                            <span>{errorMsg}</span>
                        </div>
                    )}
                </div>

                {/* Validation Result Box */}
                {result && (
                    <div
                        className="card animate-fade-in"
                        style={{
                            padding: "2rem",
                            border: `2px solid ${
                                result.isValid ? "var(--success)" : result.status === "already_used" ? "var(--warning)" : "var(--danger)"
                            }`,
                            background: result.isValid ? "var(--success-light)" : result.status === "already_used" ? "var(--warning-light)" : "var(--danger-light)"
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                            {result.isValid ? (
                                <CheckCircle2 size={36} color="var(--success)" style={{ flexShrink: 0 }} />
                            ) : result.status === "already_used" ? (
                                <AlertCircle size={36} color="var(--warning)" style={{ flexShrink: 0 }} />
                            ) : (
                                <XCircle size={36} color="var(--danger)" style={{ flexShrink: 0 }} />
                            )}

                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                                    <h3 style={{
                                        fontSize: "1.375rem",
                                        fontWeight: 800,
                                        color: result.isValid ? "var(--success)" : result.status === "already_used" ? "#b45309" : "var(--danger)"
                                    }}>
                                        {result.isValid ? "VALID TICKET — ACCESS GRANTED" : result.status === "already_used" ? "ALREADY CHECKED IN" : "INVALID / UNVERIFIED TICKET"}
                                    </h3>
                                    <Badge status={result.status}>{result.status}</Badge>
                                </div>
                                <p style={{ fontSize: "0.9375rem", color: "var(--text-main)", marginTop: "0.25rem", fontWeight: 500 }}>
                                    {result.message}
                                </p>

                                {result.ticket && (
                                    <div style={{
                                        marginTop: "1.25rem",
                                        padding: "1.25rem",
                                        background: "white",
                                        borderRadius: "var(--radius-md)",
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                        gap: "1rem"
                                    }}>
                                        <div>
                                            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Attendee Name</p>
                                            <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>{result.ticket.attendee?.name || "Guest"}</p>
                                            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{result.ticket.attendee?.email}</p>
                                        </div>

                                        <div>
                                            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Event Title</p>
                                            <p style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-main)" }}>{result.ticket.event?.title}</p>
                                            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{result.ticket.ticketTypeName} (₹{result.ticket.unitPrice})</p>
                                        </div>

                                        <div>
                                            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Ticket Code</p>
                                            <p style={{ fontSize: "0.8125rem", fontFamily: "monospace", fontWeight: 700, color: "var(--primary)" }}>{result.ticket.ticketCode}</p>
                                            {result.ticket.checkedInAt && (
                                                <p style={{ fontSize: "0.75rem", color: "var(--warning)", fontWeight: 600 }}>
                                                    Checked in at {new Date(result.ticket.checkedInAt).toLocaleTimeString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {result.isValid && (
                                    <div style={{ marginTop: "1.5rem" }}>
                                        <button
                                            onClick={handleCheckIn}
                                            disabled={loading}
                                            className="btn btn-primary btn-lg"
                                            style={{ background: "var(--success)", borderColor: "var(--success)" }}
                                        >
                                            <UserCheck size={20} />
                                            Confirm Gate Check-In
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Session Scan History */}
                {recentScans.length > 0 && (
                    <div className="card">
                        <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "1rem" }}>
                            Recent Gate Scans (Session History)
                        </h3>
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Ticket Code</th>
                                        <th>Attendee</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentScans.map((scan, idx) => (
                                        <tr key={idx}>
                                            <td style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>{scan.time}</td>
                                            <td style={{ fontFamily: "monospace", fontWeight: 600 }}>{scan.code}</td>
                                            <td>{scan.attendee || "Attendee"}</td>
                                            <td><Badge status={scan.status}>{scan.status}</Badge></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QRScannerPage;
