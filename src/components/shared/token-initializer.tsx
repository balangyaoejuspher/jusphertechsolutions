"use client"

import { useEffect } from "react"

export function TokenInitializer() {
    useEffect(() => {
        const today = new Date().toISOString().split("T")[0]
        const lastFetched = localStorage.getItem("token_fetched_date")

        if (lastFetched === today) return

        fetch("/api/auth/token", {
            method: "POST",
            credentials: "include",
        })
            .then((res) => {
                if (res.ok) {
                    localStorage.setItem("token_fetched_date", today)
                }
            })
            .catch(console.error)
    }, [])

    return null
}