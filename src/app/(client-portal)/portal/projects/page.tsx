import ProjectsPage, { ProjectsPageSkeleton } from "@/components/portal/projects/ProjectsPage"
import { Suspense } from "react"

export default function Page() {
    return (
        <Suspense fallback={<ProjectsPageSkeleton />}>
            <ProjectsPage />
        </Suspense>
    )
}