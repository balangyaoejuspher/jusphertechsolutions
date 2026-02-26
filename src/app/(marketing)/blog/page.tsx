import type { Metadata } from "next"
import { Suspense } from "react"
import { postService } from "@/server/services/blog.service"
import BlogPageClient from "./blog-page-client"

export const metadata: Metadata = {
    title: "Blog",
    description: "Insights on outsourcing, blockchain, software development, and building remote teams — from the Juspher & Co. Tech Solutions team.",
}

export default async function Page() {
    const result = await postService.getPublished({ limit: 100 })
    return (
        <Suspense>
            <BlogPageClient posts={result.items} />
        </Suspense>
    )
}