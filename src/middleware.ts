import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"])
const isPortalRoute = createRouteMatcher(["/portal(.*)"])

const isPublicApiRoute = createRouteMatcher([
  "/api/auth/token",
  "/api/auth/me",
  "/api/v1/public/(.*)",
  "/api/v1/admin/inquiries",
])

export default clerkMiddleware(async (auth, req) => {

  if (isPublicApiRoute(req)) return NextResponse.next()

  if (isDashboardRoute(req)) {
    const { userId } = await auth()
    if (!userId) return NextResponse.redirect(new URL("/sign-in", req.url))
    await auth.protect()
  }

  if (isPortalRoute(req)) {
    const { userId } = await auth()
    if (!userId) return NextResponse.redirect(new URL("/sign-in", req.url))
  }

})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}