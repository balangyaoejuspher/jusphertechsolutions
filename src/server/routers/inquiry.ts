import { createTRPCRouter, publicProcedure } from "@/server/trpc"
import { db } from "@/server/db/client"
import { inquiries } from "@/server/db/schema"
import { z } from "zod"

export const inquiryRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        company: z.string().optional(),
        message: z.string().min(10),
        talentId: z.string().uuid().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await db.insert(inquiries).values(input).returning()
      return result[0]
    }),
})