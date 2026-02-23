import { Suspense } from "react"
import { PageSkeleton } from "@/components/shared/page-skeleton"
import SignInPage from "@/components/auth/SignInPage"

export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <SignInPage />
    </Suspense>
  )
}