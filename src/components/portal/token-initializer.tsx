"use client"

import { useEffect } from "react"

export function TokenInitializer() {
    useEffect(() => {
        fetch("/api/auth/token", { method: "POST" })
    }, [])

    return null
}