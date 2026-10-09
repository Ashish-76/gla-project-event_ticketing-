import React, { useRef } from "react";
import Modal from "../UI/Modal";
import Badge from "../UI/Badge";
import { Calendar, Clock, MapPin, Download, Printer, CheckCircle2, Ticket as TicketIcon } from "lucide-react";

const TicketModal = ({ isOpen, onClose, ticket, booking }) => {
    const printRef = useRef(null);

    if (!ticket && !booking) return null;

    const event = ticket?.event || booking?.event;
    const ticketCode = ticket?.ticketCode || `TKT-${booking?.bookingReference}`;
    const qrCodeUrl = ticket?.qrCode;
    const ticketTypeName = ticket?.ticketTypeName || booking?.ticketTypeName;
    const attendeeName = ticket?.attendee?.name || booking?.attendee?.name || "Attendee";
    const status = ticket?.status || booking?.status || "active";
    const price = ticket?.unitPrice || booking?.unitPrice || 0;

    const handlePrint = () => {
        window.print();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Digital E-Ticket Pass" maxWidth={500}>
            <div ref={printRef} className="printable-ticket">
                {/* Visual Pass Card */}
                <div style={{
                    background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
                    color: "white",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 15px 30px rgba(15, 23, 42, 0.3)",
                    border: "1px solid rgba(255, 255, 255, 0.1)"
                }}>
                    {/* Header Banner */}
                    <div style={{
                        padding: "1.25rem 1.5rem",
                        background: "rgba(255, 255, 255, 0.05)",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <div style={{
                                width: 28,
                                height: 28,
                                borderRadius: "8px",
                                background: "var(--primary)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <TicketIcon size={16} />
                            </div>
                            <span style={{ fontWeight: 800, fontSize: "0.9375rem", letterSpacing: "0.05em" }}>
                                EVENTIX PASS
                            </span>
                        </div>
                        <Badge status={status}>{status}</Badge>
                    </div>

                    {/* Event Info */}
                    <div style={{ padding: "1.5rem" }}>
                        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "white", marginBottom: "0.5rem" }}>
                            {event?.title}
                        </h2>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", fontSize: "0.8125rem", color: "#cbd5e1", margin: "1rem 0" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <Calendar size={15} color="#818cf8" />
                                <span>{event?.date ? new Date(event.date).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : "Date TBA"}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <Clock size={15} color="#818cf8" />
                                <span>{event?.startTime} - {event?.endTime}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <MapPin size={15} color="#818cf8" />
                                <span>{event?.venue}, {event?.location}</span>
                            </div>
                        </div>

                        {/* Perforated Divider */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            margin: "1.25rem -1.5rem",
                            position: "relative"
                        }}>
                            <div style={{ width: 16, height: 16, background: "white", borderRadius: "50%", position: "absolute", left: -8 }} />
                            <div style={{ flex: 1, borderTop: "2px dashed rgba(255, 255, 255, 0.25)", margin: "0 1.5rem" }} />
                            <div style={{ width: 16, height: 16, background: "white", borderRadius: "50%", position: "absolute", right: -8 }} />
                        </div>

                        {/* QR Code & Attendee Meta */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                            <div>
                                <p style={{ fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>
                                    Attendee
                                </p>
                                <p style={{ fontSize: "0.9375rem", fontWeight: 700, color: "white" }}>
                                    {attendeeName}
                                </p>

                                <div style={{ marginTop: "0.75rem" }}>
                                    <p style={{ fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>
                                        Ticket Tier
                                    </p>
                                    <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#38bdf8" }}>
                                        {ticketTypeName} (₹{price})
                                    </p>
                                </div>

                                <div style={{ marginTop: "0.75rem" }}>
                                    <p style={{ fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>
                                        Ticket Code
                                    </p>
                                    <p style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#fcd34d", fontWeight: 700 }}>
                                        {ticketCode}
                                    </p>
                                </div>
                            </div>

                            {/* QR Image */}
                            <div style={{
                                background: "white",
                                padding: "0.5rem",
                                borderRadius: "12px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
                            }}>
                                {qrCodeUrl ? (
                                    <img src={qrCodeUrl} alt="Ticket QR Code" style={{ width: 120, height: 120, display: "block" }} />
                                ) : (
                                    <div style={{ width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9", color: "#64748b", fontSize: "0.75rem", textAlign: "center" }}>
                                        Scan at Gate
                                    </div>
                                )}
                                <span style={{ fontSize: "0.625rem", color: "#64748b", fontWeight: 700, marginTop: "0.25rem" }}>
                                    GATE PASS
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Verification Notice */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.75rem 1rem",
                    background: "var(--success-light)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--success)",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    margin: "1.25rem 0"
                }}>
                    <CheckCircle2 size={18} />
                    <span>Present this QR Code on your device or printed pass at the venue entrance.</span>
                </div>

                {/* Print / Action Buttons */}
                <div style={{ display: "flex", gap: "0.75rem" }} className="no-print">
                    <button
                        onClick={handlePrint}
                        className="btn btn-primary"
                        style={{ flex: 1 }}
                    >
                        <Printer size={18} />
                        Print / Save PDF
                    </button>
                    <button
                        onClick={onClose}
                        className="btn btn-secondary"
                        style={{ flex: 1 }}
                    >
                        Close
                    </button>
                </div>
            </div>

            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    .printable-ticket, .printable-ticket * { visibility: visible; }
                    .printable-ticket { position: absolute; left: 0; top: 0; width: 100%; }
                    .no-print { display: none !important; }
                }
            `}</style>
        </Modal>
    );
};

export default TicketModal;
