import React from "react";
import { Loader2 } from "lucide-react";

const Loader = ({ text = "Loading...", size = 28 }) => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            padding: "2rem",
            color: "var(--text-muted)"
        }}>
            <Loader2 size={size} style={{ animation: "spin 1s linear infinite", color: "var(--primary)" }} />
            {text && <p style={{ fontSize: "0.9375rem", fontWeight: 500 }}>{text}</p>}
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Loader;
