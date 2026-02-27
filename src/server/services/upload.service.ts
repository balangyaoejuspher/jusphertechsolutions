import { uploadFile, deleteFile, extractStoragePath, type UploadBucket } from "@/lib/supabase/storage"
import { admins, clients, companySettings } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { BaseService } from "./base.service"

const AVATAR_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const LOGO_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]
const MAX_AVATAR_MB = 2
const MAX_LOGO_MB = 5
const MAX_CONTRACT_MB = 20

export class UploadService extends BaseService {

    async uploadAdminAvatar(clerkUserId: string, file: File): Promise<string> {
        this.validateImage(file, AVATAR_ALLOWED_TYPES, MAX_AVATAR_MB)

        const admin = await this.db.query.admins.findFirst({
            where: eq(admins.clerkUserId, clerkUserId),
        })
        if (!admin) throw new Error("Admin not found")

        // Delete old avatar if exists
        if (admin.avatarUrl) {
            await this.safeDelete("avatars", admin.avatarUrl)
        }

        const ext = file.type.split("/")[1]
        const path = `admins/${admin.id}/avatar.${ext}`
        const buffer = Buffer.from(await file.arrayBuffer())
        const url = await uploadFile("avatars", path, buffer, file.type)

        await this.db
            .update(admins)
            .set({ avatarUrl: url, updatedAt: new Date() })
            .where(eq(admins.clerkUserId, clerkUserId))

        return url
    }

    async uploadClientAvatar(clientId: string, file: File): Promise<string> {
        this.validateImage(file, AVATAR_ALLOWED_TYPES, MAX_AVATAR_MB)

        const client = await this.db.query.clients.findFirst({
            where: eq(clients.id, clientId),
        })
        if (!client) throw new Error("Client not found")

        if (client.avatarUrl) {
            await this.safeDelete("avatars", client.avatarUrl)
        }

        const ext = file.type.split("/")[1]
        const path = `clients/${clientId}/avatar.${ext}`
        const buffer = Buffer.from(await file.arrayBuffer())
        const url = await uploadFile("avatars", path, buffer, file.type)

        await this.db
            .update(clients)
            .set({ avatarUrl: url, updatedAt: new Date() })
            .where(eq(clients.id, clientId))

        return url
    }

    async uploadCompanyLogo(file: File): Promise<string> {
        this.validateImage(file, LOGO_ALLOWED_TYPES, MAX_LOGO_MB)

        const existing = await this.db.query.companySettings.findFirst()
        if (existing?.logoUrl) {
            await this.safeDelete("logos", existing.logoUrl)
        }

        const ext = file.type === "image/svg+xml" ? "svg" : file.type.split("/")[1]
        const path = `company/logo.${ext}`
        const buffer = Buffer.from(await file.arrayBuffer())
        const url = await uploadFile("logos", path, buffer, file.type)

        if (existing) {
            await this.db
                .update(companySettings)
                .set({ logoUrl: url, updatedAt: new Date() })
                .where(eq(companySettings.id, existing.id))
        }

        return url
    }

    async uploadContract(file: File, projectId?: string): Promise<string> {
        if (file.type !== "application/pdf") throw new Error("Only PDF files are allowed")
        if (file.size > MAX_CONTRACT_MB * 1024 * 1024)
            throw new Error(`Max file size is ${MAX_CONTRACT_MB}MB`)

        const timestamp = Date.now()
        const folder = projectId ?? "misc"
        const safeName = file.name.replace(/[^a-z0-9._-]/gi, "_")
        const path = `${folder}/${timestamp}-${safeName}`
        const buffer = Buffer.from(await file.arrayBuffer())

        return uploadFile("contracts", path, buffer, "application/pdf")
    }

    private validateImage(file: File, allowedTypes: string[], maxMb: number) {
        if (!allowedTypes.includes(file.type))
            throw new Error(`Allowed types: ${allowedTypes.join(", ")}`)
        if (file.size > maxMb * 1024 * 1024)
            throw new Error(`Max file size is ${maxMb}MB`)
    }

    private async safeDelete(bucket: UploadBucket, publicUrl: string) {
        try {
            const path = extractStoragePath(publicUrl)
            if (path) await deleteFile(bucket, path)
        } catch {
            // Don't fail the upload if old file deletion fails
        }
    }
}

export const uploadService = new UploadService()