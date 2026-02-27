"use client"

import { useEffect, useRef } from "react"
import { useAuth } from "@clerk/nextjs"


const TOKEN_REFRESH_BEFORE_EXPIRY_MS = 60 * 60 * 1000 
const TOKEN_MAX_AGE_MS = 24 * 60 * 60 * 1000
const REFRESH_CHECK_INTERVAL_MS = 15 * 60 * 1000
const MAX_RETRIES = 3
const RETRY_DELAY_MS = 2000


let initPromise: Promise<void> | null = null
let lastInitAt: number | null = null

async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchToken(retries = MAX_RETRIES): Promise<boolean> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const res = await fetch("/api/auth/token", {
                method: "POST",
                credentials: "include",
            })

            if (res.ok) {
                lastInitAt = Date.now()
                return true
            }

            // 401 means Clerk session is gone — no point retrying
            if (res.status === 401) {
                console.warn("[TokenManager] Not authenticated, skipping token init")
                return false
            }

            console.warn(`[TokenManager] Attempt ${attempt}/${retries} failed (${res.status})`)
        } catch (err) {
            console.warn(`[TokenManager] Attempt ${attempt}/${retries} network error:`, err)
        }

        if (attempt < retries) await sleep(RETRY_DELAY_MS * attempt)
    }

    console.error("[TokenManager] All retry attempts exhausted")
    return false
}

async function deleteToken() {
    try {
        await fetch("/api/auth/token", {
            method: "DELETE",
            credentials: "include",
        })
        lastInitAt = null
        initPromise = null
    } catch (err) {
        console.error("[TokenManager] Failed to delete token:", err)
    }
}

function shouldRefresh(): boolean {
    if (!lastInitAt) return true
    const age = Date.now() - lastInitAt
    return age >= TOKEN_MAX_AGE_MS - TOKEN_REFRESH_BEFORE_EXPIRY_MS
}

export async function initToken(): Promise<void> {
    if (!shouldRefresh()) return
    if (initPromise) return initPromise

    initPromise = fetchToken().then(() => {
        initPromise = null
    })
    return initPromise
}

export function TokenManager() {
    const { isSignedIn, isLoaded } = useAuth()
    const refreshTimer = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (!isLoaded) return

        if (isSignedIn) {
            initToken()
        } else {
            if (lastInitAt) deleteToken()
        }
    }, [isSignedIn, isLoaded])

    useEffect(() => {
        if (!isSignedIn) return

        refreshTimer.current = setInterval(() => {
            if (shouldRefresh()) {
                initToken()
            }
        }, REFRESH_CHECK_INTERVAL_MS)

        return () => {
            if (refreshTimer.current) clearInterval(refreshTimer.current)
        }
    }, [isSignedIn])

    return null
}