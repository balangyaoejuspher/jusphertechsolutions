"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BackButton() {
    const router = useRouter()

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back()
        } else {
            router.push("/dashboard")
        }
    }

    return (
        <Button
            onClick={handleBack}
            variant="outline"
            className="rounded-xl border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 gap-2"
        >
            <ArrowLeft size={15} />
            Go Back
        </Button>
    )
}