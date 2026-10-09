import React, { useEffect } from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, maxWidth = 550 }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                style={{ maxWidth: maxWidth }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1.25rem 1.5rem",
                    borderBottom: "1px solid var(--border-light)"
                }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-main)" }}>
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        style={{
                            color: "var(--text-muted)",
                            padding: "0.25rem",
                            borderRadius: "var(--radius-sm)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>
                <div style={{ padding: "1.5rem" }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
