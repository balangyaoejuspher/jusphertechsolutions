import ProjectsList, { ProjectsPageSkeleton } from "@/components/portal/projects/project-list"
import { requireActiveClient } from "@/lib/client-auth"
import { redirect } from "next/dist/client/components/navigation"
import { Suspense } from "react"

export default async function Page() {
    const client = await requireActiveClient()
    if (!client) redirect("/unauthorized")
    return (
        <Suspense fallback={<ProjectsPageSkeleton />}>
            <ProjectsList />
        </Suspense>
    )
}