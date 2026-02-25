import { Suspense } from "react"
import { PageSkeleton } from "@/components/shared/page-skeleton"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { DashboardOverviewClient } from "@/components/dashboard/dashboard-overview"
import { DashboardStats } from "@/types/dashboard"

export default async function Page() {
    const { userId } = await auth()
    if (!userId) redirect("/sign-in")

    const user = await currentUser()

    // ── DB queries ──────────────────────────────────────────────
    // TODO: replace mock with real queries once schema is finalized
    // const [talentCount]     = await db.select({ count: count() }).from(talent)
    // const [inquiryCount]    = await db.select({ count: count() }).from(inquiries)
    // const [placementCount]  = await db.select({ count: count() }).from(placements)
    //
    // const monthly = await db.execute(sql`
    //   SELECT
    //     TO_CHAR(created_at, 'Mon') as month,
    //     COUNT(*) FILTER (WHERE table_name = 'inquiries')  as inquiries,
    //     COUNT(*) FILTER (WHERE table_name = 'placements') as placements,
    //     COUNT(*) FILTER (WHERE table_name = 'talent')     as talent
    //   FROM (
    //     SELECT created_at, 'inquiries'  as table_name FROM inquiries
    //     UNION ALL
    //     SELECT created_at, 'placements' as table_name FROM placements
    //     UNION ALL
    //     SELECT created_at, 'talent'     as table_name FROM talent
    //   ) combined
    //   WHERE created_at >= NOW() - INTERVAL '6 months'
    //   GROUP BY TO_CHAR(created_at, 'Mon'), DATE_TRUNC('month', created_at)
    //   ORDER BY DATE_TRUNC('month', created_at)
    // `)

    // ── Mock data — remove when DB queries above are wired ──────
    const stats: DashboardStats = {
        totalTalent: 36,
        totalInquiries: 23164,
        totalPlacements: 5234,
        avgMatchTime: "48hr",
        monthlyData: [
            { month: "Sep", inquiries: 210, placements: 42, talent: 3 },
            { month: "Oct", inquiries: 380, placements: 68, talent: 5 },
            { month: "Nov", inquiries: 290, placements: 55, talent: 2 },
            { month: "Dec", inquiries: 420, placements: 89, talent: 7 },
            { month: "Jan", inquiries: 510, placements: 102, talent: 8 },
            { month: "Feb", inquiries: 640, placements: 128, talent: 11 },
        ],
        recentActivity: [
            { text: "New inquiry received from Acme Corp", time: "Just now", type: "inquiry" },
            { text: "Alex R. profile updated", time: "2 hours ago", type: "talent" },
            { text: "Maria S. placed at TechStartup Inc.", time: "Yesterday", type: "placement" },
            { text: "New developer application received", time: "2 days ago", type: "talent" },
            { text: "Follow-up sent to GlobalVentures Ltd.", time: "3 days ago", type: "inquiry" },
            { text: "James T. successfully placed at DataCo", time: "4 days ago", type: "placement" },
        ],
    }

    return (
        <Suspense fallback={<PageSkeleton />}>
            <DashboardOverviewClient
                firstName={user?.firstName ?? null}
                stats={stats}
            />
        </Suspense>
    )
}