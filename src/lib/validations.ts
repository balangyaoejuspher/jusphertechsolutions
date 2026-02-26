import { z } from "zod"

export const POST_CATEGORIES = [
    "Outsourcing",
    "Blockchain & Web3",
    "Development",
    "Products",
] as const

export const POST_STATUSES = ["published", "draft"] as const


const category = z.enum(POST_CATEGORIES)
const status = z.enum(POST_STATUSES)

export const createPostSchema = z.object({
    slug: z.string().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
    title: z.string().min(1, "Title is required").max(255),
    excerpt: z.string().min(1, "Excerpt is required"),
    content: z.string().default(""),
    category: category,
    tag: z.string().max(100).optional(),
    author: z.string().min(1, "Author is required").max(100),
    role: z.string().max(100).optional(),
    readTime: z.string().min(1).max(50).default("5 min read"),
    date: z.string().min(1, "Date is required"),
    status: status.default("draft"),
})

export const updatePostSchema = createPostSchema.partial()

export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>

export const publicPostsQuerySchema = z.object({
    category: category.optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
})

export const adminPostsQuerySchema = z.object({
    category: category.optional(),
    status: status.optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
})

export const searchQuerySchema = z.object({
    q: z.string().min(1, "Query is required").max(200),
    category: category.optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
})

export const relatedQuerySchema = z.object({
    limit: z.coerce.number().int().min(1).max(6).default(3),
})

export type PublicPostsQuery = z.infer<typeof publicPostsQuerySchema>
export type AdminPostsQuery = z.infer<typeof adminPostsQuerySchema>
export type SearchQuery = z.infer<typeof searchQuerySchema>