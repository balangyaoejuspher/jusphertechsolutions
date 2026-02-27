import { CSSProperties } from "react"

const TYPE_BADGE: Record<string, { bg: string; border: string; color: string; label: string }> = {
    general: { bg: "#f4f4f5", border: "#e4e4e7", color: "#71717a", label: "General" },
    maintenance: { bg: "#fef9c3", border: "#fde68a", color: "#a16207", label: "Maintenance" },
    new_feature: { bg: "#f0fdf4", border: "#bbf7d0", color: "#15803d", label: "New Feature" },
    urgent: { bg: "#fef2f2", border: "#fecaca", color: "#dc2626", label: "Urgent" },
    event: { bg: "#eff6ff", border: "#bfdbfe", color: "#1d4ed8", label: "Event" },
}

export function getTypeBadge(type: string) {
    return TYPE_BADGE[type] ?? TYPE_BADGE.general
}

export const announcementEmailStyles: Record<string, CSSProperties> = {
    body: {
        backgroundColor: "#f4f4f5",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        margin: 0,
        padding: "40px 0",
    },
    container: {
        maxWidth: "560px",
        margin: "0 auto",
        padding: "0 20px",
    },
    header: {
        backgroundColor: "#09090b",
        border: "1px solid #27272a",
        borderRadius: "16px",
        padding: "32px",
        marginBottom: "16px",
        textAlign: "center",
    },
    headerLabel: {
        color: "#fbbf24",
        fontSize: "11px",
        fontWeight: "700",
        letterSpacing: "2px",
        margin: "0 0 12px 0",
    },
    headerTitle: {
        color: "#ffffff",
        fontSize: "24px",
        fontWeight: "700",
        margin: "0 0 8px 0",
        lineHeight: "1.2",
    },
    headerSub: {
        color: "#a1a1aa",
        fontSize: "14px",
        lineHeight: "1.6",
        margin: "0",
    },
    badge: {
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: "99px",
        fontSize: "11px",
        fontWeight: "700",
        letterSpacing: "0.5px",
        marginBottom: "16px",
    },
    card: {
        backgroundColor: "#ffffff",
        border: "1px solid #e4e4e7",
        borderRadius: "16px",
        padding: "24px 28px",
        marginBottom: "16px",
    },
    sectionLabel: {
        color: "#a1a1aa",
        fontSize: "10px",
        fontWeight: "700",
        letterSpacing: "2px",
        margin: "0 0 12px 0",
    },
    divider: {
        borderColor: "#e4e4e7",
        margin: "0 0 20px 0",
    },
    announcementTitle: {
        color: "#09090b",
        fontSize: "20px",
        fontWeight: "700",
        margin: "0 0 8px 0",
        lineHeight: "1.3",
    },
    date: {
        color: "#a1a1aa",
        fontSize: "12px",
        margin: "0 0 20px 0",
    },
    content: {
        color: "#3f3f46",
        fontSize: "15px",
        lineHeight: "1.7",
        margin: "0",
        whiteSpace: "pre-wrap",
    },
    ctaSection: {
        backgroundColor: "#fffbeb",
        border: "1px solid #fde68a",
        borderRadius: "12px",
        padding: "20px 24px",
        marginBottom: "16px",
        textAlign: "center",
    },
    ctaText: {
        color: "#92400e",
        fontSize: "13px",
        lineHeight: "1.6",
        margin: "0 0 16px 0",
    },
    ctaButton: {
        display: "inline-block",
        padding: "12px 28px",
        backgroundColor: "#fbbf24",
        color: "#09090b",
        fontSize: "14px",
        fontWeight: "700",
        borderRadius: "12px",
        textDecoration: "none",
    },
    footer: {
        padding: "0",
        marginBottom: "40px",
    },
    footerText: {
        color: "#a1a1aa",
        fontSize: "11px",
        lineHeight: "1.6",
        textAlign: "center",
        margin: "12px 0 0 0",
    },
}