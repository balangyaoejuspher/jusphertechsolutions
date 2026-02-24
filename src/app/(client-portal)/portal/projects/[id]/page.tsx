
import { Suspense } from "react"
import { ProjectDetailContent, ProjectDetailSkeleton } from "@/components/portal/projects/project-details"
import { redirect } from "next/dist/client/components/navigation"
import { requireActiveClient } from "@/lib/client-auth"

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const client = await requireActiveClient()
    if (!client) redirect("/unauthorized")
    const { id } = await params
    return (
        <Suspense fallback={<ProjectDetailSkeleton />}>
            <ProjectDetailContent id={id} />
        </Suspense>
    )
}