"use client"

import { useState, useRef, useEffect } from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectOption<T extends string> {
    value: T
    label: string
}

interface CustomSelectProps<T extends string> {
    value: T
    options: readonly SelectOption<T>[]
    onChange: (value: T) => void
    placeholder?: string
    className?: string
    buttonClassName?: string
}

export function CustomSelect<T extends string = string>({
    value,
    options,
    onChange,
    placeholder = "Select...",
    className,
    buttonClassName,
}: CustomSelectProps<T>) {
    const [open, setOpen] = useState(false)
    const [dropUp, setDropUp] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const selected = options.find((o) => o.value === value)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    const handleToggle = () => {
        if (!open && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            const spaceBelow = window.innerHeight - rect.bottom
            const dropdownHeight = options.length * 42
            setDropUp(spaceBelow < dropdownHeight && rect.top > dropdownHeight)
        }
        setOpen((prev) => !prev)
    }

    return (
        <div ref={ref} className={cn("relative", className)}>
            <button
                ref={buttonRef}
                type="button"
                onClick={handleToggle}
                className={cn(
                    "w-full h-10 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border text-sm text-left flex items-center justify-between gap-2 transition-colors",
                    open
                        ? "border-amber-400 dark:border-amber-400"
                        : "border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20",
                    selected
                        ? "text-zinc-900 dark:text-white"
                        : "text-zinc-400 dark:text-zinc-600",
                    buttonClassName,
                )}
            >
                <span className="truncate">{selected?.label ?? placeholder}</span>
                <ChevronDown
                    size={14}
                    className={cn(
                        "shrink-0 text-zinc-400 transition-transform duration-200",
                        open && "rotate-180"
                    )}
                />
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    className={cn(
                        "absolute z-50 w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-xl shadow-lg overflow-hidden",
                        dropUp
                            ? "bottom-[calc(100%+6px)]"
                            : "top-[calc(100%+6px)]"
                    )}
                >
                    {options.map((option) => {
                        const isSelected = option.value === value
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => { onChange(option.value); setOpen(false) }}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2.5 text-sm text-left transition-colors",
                                    isSelected
                                        ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold"
                                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5"
                                )}
                            >
                                {option.label}
                                {isSelected && <Check size={13} className="text-amber-500 shrink-0" />}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}