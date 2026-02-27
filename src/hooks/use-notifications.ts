"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { Notification } from "@/server/db/schema"

type NotificationState = {
    items: Notification[]
    unreadCount: number
    loading: boolean
    connected: boolean
}

export function useNotifications() {
    const [state, setState] = useState<NotificationState>({
        items: [],
        unreadCount: 0,
        loading: true,
        connected: false,
    })
    const eventSourceRef = useRef<EventSource | null>(null)

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await fetch("/api/v1/admin/notifications", {
                credentials: "include",
            })
            if (!res.ok) return
            const json = await res.json()
            const { items, unreadCount } = json?.data ?? json
            setState((prev) => ({ ...prev, items, unreadCount, loading: false }))
        } catch {
            setState((prev) => ({ ...prev, loading: false }))
        }
    }, [])

    const connectSSE = useCallback(() => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close()
        }

        const es = new EventSource("/api/v1/admin/notifications/sse", {
            withCredentials: true,
        })
        eventSourceRef.current = es

        es.addEventListener("connected", () => {
            setState((prev) => ({ ...prev, connected: true }))
        })

        es.onmessage = (event) => {
            try {
                const notification: Notification = JSON.parse(event.data)
                setState((prev) => ({
                    ...prev,
                    items: [notification, ...prev.items],
                    unreadCount: prev.unreadCount + 1,
                }))
            } catch {
                // ignore malformed events
            }
        }

        es.onerror = () => {
            setState((prev) => ({ ...prev, connected: false }))
            es.close()
            // Reconnect after 5 seconds
            setTimeout(connectSSE, 5_000)
        }
    }, [])

    useEffect(() => {
        fetchNotifications()
        connectSSE()

        return () => {
            eventSourceRef.current?.close()
        }
    }, [fetchNotifications, connectSSE])

    const markAsRead = useCallback(async (id: string) => {
        setState((prev) => ({
            ...prev,
            items: prev.items.map((n) => n.id === id ? { ...n, read: true } : n),
            unreadCount: Math.max(0, prev.unreadCount - 1),
        }))

        await fetch(`/api/v1/admin/notifications/${id}`, {
            method: "PATCH",
            credentials: "include",
        })
    }, [])

    const markAllAsRead = useCallback(async () => {
        setState((prev) => ({
            ...prev,
            items: prev.items.map((n) => ({ ...n, read: true })),
            unreadCount: 0,
        }))

        await fetch("/api/v1/admin/notifications", {
            method: "PATCH",
            credentials: "include",
        })
    }, [])

    const deleteNotification = useCallback(async (id: string) => {
        const notification = state.items.find((n) => n.id === id)
        setState((prev) => ({
            ...prev,
            items: prev.items.filter((n) => n.id !== id),
            unreadCount: notification && !notification.read
                ? Math.max(0, prev.unreadCount - 1)
                : prev.unreadCount,
        }))

        await fetch(`/api/v1/admin/notifications/${id}`, {
            method: "DELETE",
            credentials: "include",
        })
    }, [state.items])

    const clearRead = useCallback(async () => {
        setState((prev) => ({
            ...prev,
            items: prev.items.filter((n) => !n.read),
        }))

        await fetch("/api/v1/admin/notifications", {
            method: "DELETE",
            credentials: "include",
        })
    }, [])

    return {
        ...state,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearRead,
        refetch: fetchNotifications,
    }
}