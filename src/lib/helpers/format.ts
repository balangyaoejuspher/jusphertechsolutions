import type { Currency } from "@/types"

export const PHP_RATE = 57.5

export function formatCurrency(amount: number, currency: Currency = "USD") {
    if (currency === "PHP") {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 2,
        }).format(amount * PHP_RATE)
    }
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(amount)
}

export function formatDate(date: string | Date) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date))
}

export function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay()
}

export function isWeekend(date: Date) {
    const day = date.getDay()
    return day === 0 // only Sunday is blocked (Mon–Sat available)
}

export function isDateInPast(date: Date) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
}

export function isTimeSlotInPast(slot: string, selectedDate: Date) {
    const now = new Date()
    const isToday = selectedDate.toDateString() === now.toDateString()
    if (!isToday) return false

    const [time, meridiem] = slot.split(" ")
    const [hours, minutes] = time.split(":").map(Number)
    let h = hours
    if (meridiem === "PM" && h !== 12) h += 12
    if (meridiem === "AM" && h === 12) h = 0

    const slotDate = new Date()
    slotDate.setHours(h, minutes, 0, 0)
    return slotDate <= now
}

export const parseBudget = (val?: string | null): string | null => {
    if (!val) return null
    const match = val.replace(/,/g, "").match(/[\d.]+/)
    return match ? match[0] : null
}