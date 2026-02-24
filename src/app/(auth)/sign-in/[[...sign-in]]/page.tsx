import { Suspense } from "react"
import { PageSkeleton } from "@/components/shared/page-skeleton"
import SignInContent from "@/components/auth/sign-in"

export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <SignInContent />
    </Suspense>
  )
}