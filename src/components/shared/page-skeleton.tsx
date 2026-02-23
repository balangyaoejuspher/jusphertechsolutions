import { cn } from "@/lib/utils"

function Sk({ className }: { className?: string }) {
    return <div className={cn("animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800", className)} />
}

export function CardSkeleton() {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-3xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <Sk className="w-10 h-10 rounded-2xl shrink-0" />
                <div><Sk className="h-4 w-32 mb-2" /><Sk className="h-3 w-48" /></div>
            </div>
            <Sk className="h-px w-full" />
            <div className="flex flex-col gap-3">
                {Array.from({ length: 4 }).map((_, i) => <Sk key={i} className="h-10 rounded-xl" />)}
            </div>
        </div>
    )
}

export function PageSkeleton() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-8">
            <Sk className="h-4 w-28 mb-6 rounded-lg" />
            <Sk className="h-8 w-56 mb-2" />
            <Sk className="h-4 w-80 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
        </div>
    )
}