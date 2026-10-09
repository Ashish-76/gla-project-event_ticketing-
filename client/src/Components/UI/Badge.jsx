import React from "react";

const Badge = ({ status, children }) => {
    const rawStatus = (status || children || "").toLowerCase();

    let badgeClass = "badge-neutral";
    if (["active", "published", "confirmed", "completed"].includes(rawStatus)) {
        badgeClass = "badge-success";
    } else if (["pending", "draft", "warning"].includes(rawStatus)) {
        badgeClass = "badge-warning";
    } else if (["cancelled", "inactive", "danger", "failed"].includes(rawStatus)) {
        badgeClass = "badge-danger";
    } else if (["used", "primary", "vip"].includes(rawStatus)) {
        badgeClass = "badge-primary";
    }

    return (
        <span className={`badge ${badgeClass}`}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "currentColor" }} />
            {children || status}
        </span>
    );
};

export default Badge;
