import React from "react";

const StatCard = ({ title, value, subtitle, icon: Icon, color = "var(--primary)", trend }) => {
    return (
        <div className="card" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
                <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {title}
                </p>
                <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-main)", margin: "0.375rem 0" }}>
                    {value}
                </h3>
                {subtitle && (
                    <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                        {subtitle}
                    </p>
                )}
                {trend && (
                    <span style={{ fontSize: "0.75rem", color: "var(--success)", fontWeight: 700, marginTop: "0.25rem", display: "inline-block" }}>
                        {trend}
                    </span>
                )}
            </div>
            {Icon && (
                <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: "var(--radius-md)",
                    backgroundColor: `${color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: color,
                    flexShrink: 0
                }}>
                    <Icon size={24} />
                </div>
            )}
        </div>
    );
};

export default StatCard;
