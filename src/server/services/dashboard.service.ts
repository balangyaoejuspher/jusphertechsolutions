import {
    clients,
    inquiries,
    invoices,
    placements,
    talent
} from "@/server/db/schema"
import type { ActivityItem, DashboardStats, MonthlyDataPoint } from "@/types/dashboard"
import { count, eq, gte, sql, sum } from "drizzle-orm"
import { BaseService } from "./base.service"
import { activityService } from "./activity.service"

export class DashboardService extends BaseService {

    async getAdminStats(): Promise<DashboardStats> {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

        const [
            [totalTalentRow],
            [vettedTalentRow],
            [totalInquiriesRow],
            [openInquiriesRow],
            [totalPlacementsRow],
            [activePlacementsRow],
            [totalClientsRow],
            [newClientsRow],
            revenueRows,
            [pendingInvoicesRow],
            monthlyRaw,
            recentLogs,
        ] = await Promise.all([
            // Talent
            this.db.select({ count: count() }).from(talent),
            this.db.select({ count: count() }).from(talent).where(eq(talent.isVetted, true)),

            // Inquiries
            this.db.select({ count: count() }).from(inquiries),
            this.db.select({ count: count() }).from(inquiries).where(
                sql`${inquiries.status} IN ('new', 'in_progress')`
            ),

            // Placements
            this.db.select({ count: count() }).from(placements),
            this.db.select({ count: count() }).from(placements).where(eq(placements.status, "active")),

            // Clients
            this.db.select({ count: count() }).from(clients),
            this.db.select({ count: count() }).from(clients).where(
                gte(clients.joinedDate, startOfMonth)
            ),

            // Revenue
            this.db.select({
                total: sum(invoices.amount),
                paid: sum(invoices.paid),
            }).from(invoices).where(eq(invoices.status, "paid")),

            // Pending invoices count
            this.db.select({ count: count() }).from(invoices).where(
                sql`${invoices.status} IN ('unpaid', 'overdue', 'partial')`
            ),

            // Monthly data (last 6 months)
            this.db.execute(sql`
                WITH months AS (
                    SELECT generate_series(
                        date_trunc('month', ${sixMonthsAgo.toISOString()}::timestamp),
                        date_trunc('month', now()),
                        '1 month'::interval
                    ) AS month
                )
                SELECT
                    to_char(m.month, 'Mon') AS month,
                    (SELECT COUNT(*) FROM inquiries WHERE date_trunc('month', created_at) = m.month) AS inquiries,
                    (SELECT COUNT(*) FROM placements WHERE date_trunc('month', created_at) = m.month) AS placements,
                    (SELECT COUNT(*) FROM talent WHERE date_trunc('month', created_at) = m.month) AS talent,
                    (SELECT COALESCE(SUM(amount), 0) FROM invoices WHERE date_trunc('month', created_at) = m.month AND status = 'paid') AS revenue
                FROM months m
                ORDER BY m.month
            `),

            activityService.getRecent(8),
        ])

        const totalRevenue = Number(revenueRows[0]?.paid ?? 0)

        const pendingRevenueRows = await this.db
            .select({ pending: sum(sql`${invoices.amount} - ${invoices.paid}`) })
            .from(invoices)
            .where(sql`${invoices.status} IN ('unpaid', 'overdue', 'partial')`)

        const pendingRevenue = Number(pendingRevenueRows[0]?.pending ?? 0)

        const monthlyData: MonthlyDataPoint[] = (monthlyRaw as any[]).map((row) => ({
            month: row.month,
            inquiries: Number(row.inquiries ?? 0),
            placements: Number(row.placements ?? 0),
            talent: Number(row.talent ?? 0),
            revenue: Number(row.revenue ?? 0),
        }))

        const activity: ActivityItem[] = recentLogs.map((log) => ({
            type: this.mapActivityType(log.type),
            text: log.summary,
            time: this.relativeTime(log.createdAt),
            meta: log.entityType ?? undefined,
        }))

        const avgMatchTime = "~48 hours"

        return {
            totalTalent: totalTalentRow?.count ?? 0,
            vettedTalent: vettedTalentRow?.count ?? 0,
            totalInquiries: totalInquiriesRow?.count ?? 0,
            openInquiries: openInquiriesRow?.count ?? 0,
            totalPlacements: totalPlacementsRow?.count ?? 0,
            activePlacements: activePlacementsRow?.count ?? 0,
            totalClients: totalClientsRow?.count ?? 0,
            newClientsThisMonth: newClientsRow?.count ?? 0,
            totalRevenue,
            pendingRevenue,
            pendingInvoices: pendingInvoicesRow?.count ?? 0,
            monthlyData,
            recentActivity: activity,
            avgMatchTime,
        }
    }

    private relativeTime(date: Date): string {
        const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
        if (diff < 60) return "just now"
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
        if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
        return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }

    private mapActivityType(type: string): ActivityItem["type"] {
        if (type.includes("inquiry")) return "inquiry"
        if (type.includes("placement")) return "placement"
        if (type.includes("talent")) return "talent"
        if (type.includes("invoice")) return "invoice"
        return "inquiry"
    }
}

export const dashboardService = new DashboardService()