import type { Metadata } from "next"

type SlugItem = {
    id?: string
    slug?: string
    title?: string
    label?: string
    description?: string
    excerpt?: string
}

type MetadataOptions<T extends SlugItem> = {
    items: T[]
    slugField?: keyof T
    notFoundTitle?: string
}

// ── generateStaticParams ──────────────────────────────────────

export function createStaticParams<T extends SlugItem>({
    items,
    slugField,
}: MetadataOptions<T>) {
    return items.map((item) => ({
        slug: String(item[slugField ?? (("slug" in item ? "slug" : "id") as keyof T)]),
    }))
}

// ── generateMetadata ──────────────────────────────────────────

export function createMetadata<T extends SlugItem>({
    items,
    slugField,
    notFoundTitle = "Not Found",
}: MetadataOptions<T>) {
    return async ({
        params,
    }: {
        params: Promise<{ slug: string }>
    }): Promise<Metadata> => {
        const { slug } = await params
        const field = slugField ?? (("slug" in (items[0] ?? {}) ? "slug" : "id") as keyof T)
        const item = items.find((i) => String(i[field]) === slug)

        if (!item) return { title: notFoundTitle }

        return {
            title: item.title ?? item.label,
            description: item.description ?? item.excerpt,
        }
    }
}