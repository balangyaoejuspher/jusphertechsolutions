import { db } from "@/server/db/client"

export abstract class BaseService {
    protected db = db

    protected paginate<T>(items: T[], page: number, pageSize: number) {
        const total = items.length
        const totalPages = Math.ceil(total / pageSize)
        const data = items.slice((page - 1) * pageSize, page * pageSize)
        return { data, total, page, pageSize, totalPages }
    }

    protected sanitize<T extends Record<string, unknown>>(obj: T): Partial<T> {
        return Object.fromEntries(
            Object.entries(obj).filter(([_, v]) => v !== undefined)
        ) as Partial<T>
    }
}