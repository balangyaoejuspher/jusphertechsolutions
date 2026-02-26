import { products } from "@/server/db/schema"
import type { Product, NewProduct } from "@/server/db/schema"
import { eq, ilike, and, asc } from "drizzle-orm"
import { BaseService } from "./base.service"
import { activityService } from "./activity.service"

type ListProductsOptions = {
    search?: string
    status?: Product["status"] | "all"
    category?: Product["category"] | "all"
    visible?: boolean
}

type CreateProductInput = Omit<NewProduct, "id" | "createdAt" | "updatedAt">
type UpdateProductInput = Partial<Omit<NewProduct, "id" | "createdAt" | "updatedAt">>

export class ProductService extends BaseService {

    async getAll(options: ListProductsOptions = {}): Promise<Product[]> {
        const { search, status, category, visible } = options

        let query = this.db.select().from(products).$dynamic()

        const conditions = []

        if (status && status !== "all") {
            conditions.push(eq(products.status, status))
        }

        if (category && category !== "all") {
            conditions.push(eq(products.category, category))
        }

        if (visible === true) {
            conditions.push(eq(products.isVisible, true))
        }

        if (search) {
            conditions.push(ilike(products.label, `%${search}%`))
        }

        if (conditions.length > 0) {
            query = query.where(and(...conditions))
        }

        return query.orderBy(asc(products.order), asc(products.createdAt))
    }

    async getById(id: string): Promise<Product | null> {
        const [row] = await this.db
            .select()
            .from(products)
            .where(eq(products.id, id))
            .limit(1)

        return row ?? null
    }

    async getBySlug(slug: string): Promise<Product | null> {
        const [row] = await this.db
            .select()
            .from(products)
            .where(eq(products.slug, slug))
            .limit(1)

        return row ?? null
    }

    async create(
        input: CreateProductInput,
        actorId: string,
        actorName: string,
    ): Promise<Product> {
        const [created] = await this.db
            .insert(products)
            .values({ ...input, createdAt: new Date(), updatedAt: new Date() })
            .returning()

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "product_created",
            summary: `Created product: ${created.label}`,
            entityType: "product",
            entityId: created.id,
            entityLabel: created.label,
            metadata: { slug: created.slug, status: created.status },
        })

        return created
    }

    async update(
        id: string,
        input: UpdateProductInput,
        actorId: string,
        actorName: string,
    ): Promise<Product> {
        const existing = await this.getById(id)
        if (!existing) throw new Error("Product not found")

        const [updated] = await this.db
            .update(products)
            .set({ ...this.sanitize(input), updatedAt: new Date() })
            .where(eq(products.id, id))
            .returning()

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "product_updated",
            summary: `Updated product: ${existing.label}`,
            entityType: "product",
            entityId: updated.id,
            entityLabel: updated.label,
            metadata: { changes: Object.keys(this.sanitize(input)) },
        })

        return updated
    }

    async toggleVisibility(
        id: string,
        actorId: string,
        actorName: string,
    ): Promise<Product> {
        const existing = await this.getById(id)
        if (!existing) throw new Error("Product not found")

        const [updated] = await this.db
            .update(products)
            .set({ isVisible: !existing.isVisible, updatedAt: new Date() })
            .where(eq(products.id, id))
            .returning()

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "product_updated",
            summary: `${updated.isVisible ? "Showed" : "Hidden"} product: ${existing.label}`,
            entityType: "product",
            entityId: updated.id,
            entityLabel: updated.label,
            metadata: { isVisible: updated.isVisible },
        })

        return updated
    }

    async updateStatus(
        id: string,
        status: Product["status"],
        actorId: string,
        actorName: string,
    ): Promise<Product> {
        const existing = await this.getById(id)
        if (!existing) throw new Error("Product not found")

        const [updated] = await this.db
            .update(products)
            .set({ status, updatedAt: new Date() })
            .where(eq(products.id, id))
            .returning()

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "product_updated",
            summary: `Changed product status to ${status}: ${existing.label}`,
            entityType: "product",
            entityId: updated.id,
            entityLabel: updated.label,
            metadata: { status },
        })

        return updated
    }

    async delete(
        id: string,
        actorId: string,
        actorName: string,
    ): Promise<void> {
        const existing = await this.getById(id)
        if (!existing) throw new Error("Product not found")

        await this.db.delete(products).where(eq(products.id, id))

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "product_deleted",
            summary: `Deleted product: ${existing.label}`,
            entityType: "product",
            entityId: existing.id,
            entityLabel: existing.label,
            metadata: { slug: existing.slug },
        })
    }
    
    async getStats() {
        const all = await this.db.select().from(products)
        return {
            total: all.length,
            available: all.filter((p) => p.status === "available").length,
            comingSoon: all.filter((p) => p.status === "coming_soon").length,
            beta: all.filter((p) => p.status === "beta").length,
            hidden: all.filter((p) => !p.isVisible).length,
            featured: all.filter((p) => p.isFeatured).length,
        }
    }
}

export const productService = new ProductService()