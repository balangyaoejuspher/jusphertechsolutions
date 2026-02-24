import * as React from "react"
import { cn } from "@/lib/utils"

function Field({
    label,
    required,
    hint,
    error,
    className,
    children,
}: {
    label: string
    required?: boolean
    hint?: string
    error?: string
    className?: string
    children: React.ReactNode
}) {
    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                {label}{required && <span className="text-amber-500 ml-0.5">*</span>}
            </label>
            {children}
            {hint && !error && (
                <p className="text-[11px] text-zinc-400 dark:text-zinc-600">{hint}</p>
            )}
            {error && (
                <p className="text-[11px] text-red-400">{error}</p>
            )}
        </div>
    )
}

export { Field }