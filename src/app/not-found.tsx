import Link from "next/link"
import { Home, Search, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import BackButton from "@/components/shared/back-button"

export default function NotFoundPage() {
    return (
        <div className="relative min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-6 overflow-hidden">

            {/* Background blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-400/5 dark:bg-amber-400/5 rounded-full blur-3xl" />
                <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-zinc-200/60 dark:bg-white/[0.02] rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-300/10 dark:bg-amber-500/5 rounded-full blur-3xl" />
            </div>

            {/* Dot grid pattern */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.3] dark:opacity-[0.15]"
                style={{
                    backgroundImage: "radial-gradient(circle, #a1a1aa 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                }}
            />

            <div className="relative flex flex-col items-center text-center max-w-lg w-full">

                <div className="relative mb-8 select-none">
                    <div className="text-[28rem] font-black leading-none tracking-tighter text-zinc-200 dark:text-white/[0.04]">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-xl shadow-zinc-200/80 dark:shadow-black/30 flex items-center justify-center">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-400/30">
                                    <Compass size={26} className="text-zinc-950" />
                                </div>
                            </div>
                            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-amber-400 shadow shadow-amber-400/50" />
                            <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                        </div>
                    </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/20 mb-4">
                    <Search size={11} className="text-amber-500" />
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                        Page Not Found
                    </span>
                </div>
                <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-3 tracking-tight">
                    Looks like you're lost
                </h1>

                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-8 max-w-sm">
                    The page you're looking for doesn't exist, was removed, or the URL might be mistyped. Let's get you back on track.
                </p>

                <div className="flex items-center gap-3">
                    <BackButton />
                    <Button
                        asChild
                        className="rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold gap-2 shadow-sm shadow-amber-400/20"
                    >
                        <Link href="/dashboard">
                            <Home size={15} />
                            Dashboard
                        </Link>
                    </Button>
                </div>

                {/* Bottom hint */}
                <div className="mt-12 flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-600">
                    <span className="w-4 h-px bg-zinc-300 dark:bg-zinc-700" />
                    Error 404 · Page Not Found
                    <span className="w-4 h-px bg-zinc-300 dark:bg-zinc-700" />
                </div>
            </div>
        </div>
    )
}