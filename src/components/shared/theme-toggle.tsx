"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return (
    <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-white/5 animate-pulse" />
  )

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200",
        "bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900",
        "dark:bg-white/5 dark:hover:bg-white/10 dark:text-zinc-400 dark:hover:text-white"
      )}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  )
}