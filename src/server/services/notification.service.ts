import { notifications, admins } from "@/server/db/schema"
import type { Notification, NewNotification, NotificationType } from "@/server/db/schema"
import { eq, and, desc, count } from "drizzle-orm"
import { BaseService } from "./base.service"

export type CreateNotificationInput = {
    adminId: string
    type: NotificationType
    title: string
    message: string
    entityId?: string
    entityType?: string
}

export class NotificationService extends BaseService {

    async create(input: CreateNotificationInput): Promise<Notification> {
        const [created] = await this.db
            .insert(notifications)
            .values(input)
            .returning()

        sseManager.push(input.adminId, created)

        return created
    }

    async broadcast(input: Omit<CreateNotificationInput, "adminId">): Promise<Notification[]> {
        const allAdmins = await this.db.select({ id: admins.id }).from(admins)
        if (allAdmins.length === 0) return []

        const values: NewNotification[] = allAdmins.map((admin) => ({
            ...input,
            adminId: admin.id,
        }))

        const created = await this.db
            .insert(notifications)
            .values(values)
            .returning()

        created.forEach((n) => sseManager.push(n.adminId, n))

        return created
    }

    async getForAdmin(adminId: string, limit = 30): Promise<Notification[]> {
        return this.db
            .select()
            .from(notifications)
            .where(eq(notifications.adminId, adminId))
            .orderBy(desc(notifications.createdAt))
            .limit(limit)
    }

    async getUnreadCount(adminId: string): Promise<number> {
        const [result] = await this.db
            .select({ count: count() })
            .from(notifications)
            .where(
                and(
                    eq(notifications.adminId, adminId),
                    eq(notifications.read, false)
                )
            )
        return result?.count ?? 0
    }

    async markAsRead(id: string, adminId: string): Promise<Notification> {
        const [updated] = await this.db
            .update(notifications)
            .set({ read: true })
            .where(
                and(
                    eq(notifications.id, id),
                    eq(notifications.adminId, adminId)
                )
            )
            .returning()
        return updated
    }

    async markAllAsRead(adminId: string): Promise<void> {
        await this.db
            .update(notifications)
            .set({ read: true })
            .where(
                and(
                    eq(notifications.adminId, adminId),
                    eq(notifications.read, false)
                )
            )
    }

    async delete(id: string, adminId: string): Promise<void> {
        await this.db
            .delete(notifications)
            .where(
                and(
                    eq(notifications.id, id),
                    eq(notifications.adminId, adminId)
                )
            )
    }

    async deleteAllRead(adminId: string): Promise<void> {
        await this.db
            .delete(notifications)
            .where(
                and(
                    eq(notifications.adminId, adminId),
                    eq(notifications.read, true)
                )
            )
    }
}

type SSEClient = {
    adminId: string
    controller: ReadableStreamDefaultController
}

class SSEManager {
    private clients: Map<string, SSEClient> = new Map()

    add(connectionId: string, adminId: string, controller: ReadableStreamDefaultController) {
        this.clients.set(connectionId, { adminId, controller })
    }

    remove(connectionId: string) {
        this.clients.delete(connectionId)
    }

    push(adminId: string, notification: Notification) {
        const payload = `data: ${JSON.stringify(notification)}\n\n`

        for (const [connectionId, client] of this.clients) {
            if (client.adminId === adminId) {
                try {
                    client.controller.enqueue(new TextEncoder().encode(payload))
                } catch {
                    this.clients.delete(connectionId)
                }
            }
        }
    }

    ping(connectionId: string) {
        const client = this.clients.get(connectionId)
        if (!client) return

        try {
            client.controller.enqueue(
                new TextEncoder().encode(`: ping\n\n`)
            )
        } catch {
            this.clients.delete(connectionId)
        }
    }

    get size() {
        return this.clients.size
    }
}

export const sseManager = new SSEManager()
export const notificationService = new NotificationService()