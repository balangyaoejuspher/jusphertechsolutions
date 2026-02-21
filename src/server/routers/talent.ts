import { createTRPCRouter, publicProcedure } from "@/server/trpc"
import { db } from "@/server/db/client"
import { talent } from "@/server/db/schema"
import { z } from "zod"
import { eq } from "drizzle-orm"

export const talentRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    return await db.select().from(talent)
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const result = await db
        .select()
        .from(talent)
        .where(eq(talent.id, input.id))
      return result[0] ?? null
    }),

  getByRole: publicProcedure
    .input(z.object({ role: z.enum(["developer", "va", "project_manager"]) }))
    .query(async ({ input }) => {
      return await db
        .select()
        .from(talent)
        .where(eq(talent.role, input.role))
    }),
})