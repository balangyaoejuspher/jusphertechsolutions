import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import {
    Users,
    FileText,
    TrendingUp,
    Clock,
    ArrowUpRight,
    CheckCircle,
} from "lucide-react"

const stats = [
    {
        label: "Total Talent",
        value: "0",
        icon: Users,
        change: "Active professionals",
        color: "text-blue-500",
        bg: "bg-blue-50",
    },
    {
        label: "Inquiries",
        value: "0",
        icon: FileText,
        change: "Client inquiries",
        color: "text-amber-500",
        bg: "bg-amber-50",
    },
    {
        label: "Placements",
        value: "0",
        icon: TrendingUp,
        change: "Successful hires",
        color: "text-green-500",
        bg: "bg-green-50",
    },
    {
        label: "Avg. Match Time",
        value: "48hr",
        icon: Clock,
        change: "Time to placement",
        color: "text-violet-500",
        bg: "bg-violet-50",
    },
]

const recentActivity = [
    { text: "New inquiry received from Acme Corp", time: "Just now", type: "inquiry" },
    { text: "Alex R. profile updated", time: "2 hours ago", type: "talent" },
    { text: "Maria S. placed at TechStartup Inc.", time: "Yesterday", type: "placement" },
    { text: "New developer application received", time: "2 days ago", type: "talent" },
]

export default async function DashboardPage() {
    const { userId } = await auth()
    if (!userId) redirect("/sign-in")

    const user = await currentUser()

    return (
        <div className="p-8 md:p-10">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-2xl font-bold text-zinc-900 mb-1">
                    Welcome back{user?.firstName ? `, ${user.firstName}` : ""}! 👋
                </h1>
                <p className="text-zinc-500 text-sm">
                    Here's what's happening with your agency today.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white rounded-2xl border border-zinc-100 p-6 hover:shadow-sm transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                <stat.icon size={18} className={stat.color} />
                            </div>
                            <ArrowUpRight size={15} className="text-zinc-300" />
                        </div>
                        <div className="text-3xl font-bold text-zinc-900 mb-1">{stat.value}</div>
                        <div className="text-sm font-medium text-zinc-700 mb-0.5">{stat.label}</div>
                        <div className="text-xs text-zinc-400">{stat.change}</div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity Feed */}
                <div className="bg-white rounded-2xl border border-zinc-100 p-6">
                    <h2 className="font-bold text-zinc-900 mb-6">Recent Activity</h2>
                    <div className="flex flex-col gap-4">
                        {recentActivity.map((activity, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckCircle size={13} className="text-zinc-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-zinc-700 leading-snug">{activity.text}</p>
                                    <p className="text-xs text-zinc-400 mt-0.5">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl border border-zinc-100 p-6">
                    <h2 className="font-bold text-zinc-900 mb-6">Quick Actions</h2>
                    <div className="flex flex-col gap-3">
                        {[
                            { label: "Add New Talent", href: "/dashboard/talent", color: "bg-amber-400 text-zinc-950 hover:bg-amber-300" },
                            { label: "View Inquiries", href: "/dashboard/inquiries", color: "bg-zinc-900 text-white hover:bg-zinc-700" },
                            { label: "Manage Services", href: "/dashboard/services", color: "bg-zinc-100 text-zinc-700 hover:bg-zinc-200" },
                            { label: "Settings", href: "/dashboard/settings", color: "bg-zinc-100 text-zinc-700 hover:bg-zinc-200" },
                        ].map((action) => (
                            <a
                                key={action.label}
                                href={action.href}
                                className={`flex items-center justify-between px-5 py-3.5 rounded-xl font-medium text-sm transition-all ${action.color}`}
                            >
                                {action.label}
                                <ArrowUpRight size={15} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}