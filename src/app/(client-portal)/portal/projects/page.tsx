import ProjectsList, { ProjectsPageSkeleton } from "@/components/portal/projects/project-list"
import { Suspense } from "react"

export default function Page() {
    return (
        <Suspense fallback={<ProjectsPageSkeleton />}>
            <ProjectsList />
        </Suspense>
    )
}