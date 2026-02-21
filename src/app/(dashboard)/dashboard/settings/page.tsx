import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
    const { userId } = await auth()
    if (!userId) redirect("/sign-in")

    const user = await currentUser()

    return (
        <div className="p-8 md:p-10 min-h-[70vh] flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
                Dashboard Under Development
            </h1>

            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-md">
                Hello{user?.firstName ? `, ${user.firstName}` : ""}!
                This section is currently being built. Please check back soon for updates.
            </p>

            <div className="mt-6 flex gap-3">
                <a
                    href="/dashboard"
                    className="px-6 py-3 rounded-xl bg-amber-400 text-zinc-950 font-medium hover:bg-amber-300 transition"
                >
                    Go to Dashboard
                </a>
                <a
                    href="/dashboard"
                    className="px-6 py-3 rounded-xl bg-zinc-100 text-zinc-700 font-medium hover:bg-zinc-200 transition"
                >
                    Refresh Page
                </a>
            </div>
        </div>
    )
}