import { posts } from "@/server/db/schema"
import type { Post, NewPost, PostStatus, PostCategory } from "@/server/db/schema"
import { eq, and, ilike, desc, count, sql } from "drizzle-orm"
import { BaseService } from "./base.service"
import { activityService } from "./activity.service"

type ListPostsOptions = {
    search?: string
    status?: PostStatus | "all"
    category?: PostCategory | "all"
    page?: number
    limit?: number
}

type CreatePostInput = Omit<NewPost, "id" | "createdAt" | "updatedAt">
type UpdatePostInput = Partial<Omit<NewPost, "id" | "createdAt" | "updatedAt">>

export type PaginatedPosts = {
    items: Post[]
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
}

export class PostService extends BaseService {

    async getAll(options: ListPostsOptions = {}): Promise<PaginatedPosts> {
        const { search, status, category, page = 1, limit = 20 } = options
        const offset = (page - 1) * limit

        let query = this.db.select().from(posts).$dynamic()
        let countQuery = this.db.select({ value: count() }).from(posts).$dynamic()

        const conditions = []

        if (status && status !== "all") {
            conditions.push(eq(posts.status, status))
        }

        if (category && category !== "all") {
            conditions.push(eq(posts.category, category))
        }

        if (search) {
            conditions.push(ilike(posts.title, `%${search}%`))
        }

        if (conditions.length > 0) {
            const where = and(...conditions)
            query = query.where(where)
            countQuery = countQuery.where(where)
        }

        const [items, [{ value: total }]] = await Promise.all([
            query.orderBy(desc(posts.createdAt)).limit(limit).offset(offset),
            countQuery,
        ])

        const totalNum = Number(total)
        const totalPages = Math.ceil(totalNum / limit)

        return {
            items,
            total: totalNum,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        }
    }

    async getById(id: string): Promise<Post | null> {
        const [row] = await this.db
            .select()
            .from(posts)
            .where(eq(posts.id, id))
            .limit(1)

        return row ?? null
    }

    async getBySlug(slug: string): Promise<Post | null> {
        const [row] = await this.db
            .select()
            .from(posts)
            .where(eq(posts.slug, slug))
            .limit(1)

        return row ?? null
    }

    async getPublished(options: Omit<ListPostsOptions, "status"> = {}): Promise<PaginatedPosts> {
        return this.getAll({ ...options, status: "published" })
    }

    async getRelated(slug: string, category: PostCategory, limit = 3): Promise<Post[]> {
        return this.db
            .select()
            .from(posts)
            .where(
                and(
                    eq(posts.category, category),
                    eq(posts.status, "published"),
                    sql`${posts.slug} != ${slug}`
                )
            )
            .orderBy(desc(posts.createdAt))
            .limit(limit)
    }

    async search(q: string, options: { category?: PostCategory; page?: number; limit?: number } = {}) {
        const { category, page = 1, limit = 10 } = options
        const offset = (page - 1) * limit
        const tsQuery = sql`plainto_tsquery('english', ${q})`

        const searchVector = sql`(
            setweight(to_tsvector('english', ${posts.title}),   'A') ||
            setweight(to_tsvector('english', ${posts.excerpt}), 'B') ||
            setweight(to_tsvector('english', ${posts.content}), 'C')
        )`

        const conditions = [
            eq(posts.status, "published"),
            sql`${searchVector} @@ ${tsQuery}`,
            ...(category ? [eq(posts.category, category)] : []),
        ]

        const where = and(...conditions)

        const [items, [{ value: total }]] = await Promise.all([
            this.db
                .select({
                    id: posts.id,
                    slug: posts.slug,
                    title: posts.title,
                    excerpt: posts.excerpt,
                    content: posts.content,
                    category: posts.category,
                    tag: posts.tag,
                    author: posts.author,
                    role: posts.role,
                    date: posts.date,
                    readTime: posts.readTime,
                    status: posts.status,
                    createdAt: posts.createdAt,
                    updatedAt: posts.updatedAt,
                    rank: sql<number>`ts_rank(${searchVector}, ${tsQuery})`,
                })
                .from(posts)
                .where(where)
                .orderBy(sql`ts_rank(${searchVector}, ${tsQuery}) DESC`)
                .limit(limit)
                .offset(offset),
            this.db.select({ value: count() }).from(posts).where(where),
        ])

        const totalNum = Number(total)
        const totalPages = Math.ceil(totalNum / limit)

        return {
            items,
            total: totalNum,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        }
    }

    async slugExists(slug: string, excludeId?: string): Promise<boolean> {
        const conditions = [eq(posts.slug, slug)]
        if (excludeId) conditions.push(sql`${posts.id} != ${excludeId}`)

        const [{ value }] = await this.db
            .select({ value: count() })
            .from(posts)
            .where(and(...conditions))

        return Number(value) > 0
    }

    async create(
        input: CreatePostInput,
        actorId: string,
        actorName: string,
    ): Promise<Post> {
        const [created] = await this.db
            .insert(posts)
            .values({
                ...input,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning()

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "post_created",
            summary: `Created post: ${created.title}`,
            entityType: "post",
            entityId: created.id,
            entityLabel: created.title,
            metadata: { status: created.status, category: created.category },
        })

        return created
    }

    async update(
        id: string,
        input: UpdatePostInput,
        actorId: string,
        actorName: string,
    ): Promise<Post> {
        const existing = await this.getById(id)
        if (!existing) throw new Error("Post not found")

        const sanitized = this.sanitize(input)

        const [updated] = await this.db
            .update(posts)
            .set({ ...this.sanitize(input), updatedAt: new Date() })
            .where(eq(posts.id, id))
            .returning()

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "post_updated",
            summary: `Updated post: ${existing.title}`,
            entityType: "post",
            entityId: updated.id,
            entityLabel: updated.title,
            metadata: { changes: Object.keys(sanitized) },
        })

        return updated
    }

    async toggleStatus(
        id: string,
        actorId: string,
        actorName: string,
    ): Promise<Post> {
        const existing = await this.getById(id)
        if (!existing) throw new Error("Post not found")

        const newStatus: PostStatus = existing.status === "published" ? "draft" : "published"

        const [updated] = await this.db
            .update(posts)
            .set({ status: newStatus, updatedAt: new Date() })
            .where(eq(posts.id, id))
            .returning()

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: newStatus === "published" ? "post_published" : "post_unpublished",
            summary: `${newStatus === "published" ? "Published" : "Unpublished"} post: ${existing.title}`,
            entityType: "post",
            entityId: updated.id,
            entityLabel: updated.title,
            metadata: { status: newStatus },
        })

        return updated
    }

    async delete(
        id: string,
        actorId: string,
        actorName: string,
    ): Promise<void> {
        const existing = await this.getById(id)
        if (!existing) throw new Error("Post not found")

        await this.db.delete(posts).where(eq(posts.id, id))

        await activityService.log({
            actorType: "admin",
            actorId,
            actorName,
            type: "post_deleted",
            summary: `Deleted post: ${existing.title}`,
            entityType: "post",
            entityId: existing.id,
            entityLabel: existing.title,
            metadata: { category: existing.category, status: existing.status },
        })
    }

    async getStats() {
        const [{ total, published, draft }] = await this.db
            .select({
                total: count(),
                published: sql<number>`count(*) filter (where ${posts.status} = 'published')`,
                draft: sql<number>`count(*) filter (where ${posts.status} = 'draft')`,
            })
            .from(posts)

        return {
            total: Number(total),
            published: Number(published),
            draft: Number(draft),
        }
    }
}

export const postService = new PostService()