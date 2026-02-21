import { createTRPCRouter } from "@/server/trpc"
import { talentRouter } from "./talent"
import { inquiryRouter } from "./inquiry"
import { serviceRouter } from "./service"
import { settingsRouter } from "./settings"

export const appRouter = createTRPCRouter({
  talent: talentRouter,
  inquiry: inquiryRouter,
  service: serviceRouter,
  settings: settingsRouter,
})

export type AppRouter = typeof appRouter