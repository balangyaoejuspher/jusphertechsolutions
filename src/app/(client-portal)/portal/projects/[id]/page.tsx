
import { Suspense } from "react"
import { ProjectDetailContent, ProjectDetailSkeleton } from "@/components/portal/projects/project-details"

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return (
        <Suspense fallback={<ProjectDetailSkeleton />}>
            <ProjectDetailContent id={id} />
        </Suspense>
    )
}