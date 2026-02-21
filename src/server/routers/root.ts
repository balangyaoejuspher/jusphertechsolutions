import { createTRPCRouter } from "@/server/trpc"
import { talentRouter } from "./talent"
import { inquiryRouter } from "./inquiry"

export const appRouter = createTRPCRouter({
  talent: talentRouter,
  inquiry: inquiryRouter,
})

export type AppRouter = typeof appRouter