import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/trpc"
import { inquiries } from "@/server/db/schema"
import { eq, desc } from "drizzle-orm"

export const inquiryRouter = createTRPCRouter({
  // Public — submit a new inquiry (contact form)
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        company: z.string().optional(),
        message: z.string().min(10),
        talentId: z.string().uuid().optional(),
        serviceId: z.string().uuid().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.insert(inquiries).values(input).returning()
      return result[0]
    }),

  // Admin — get all inquiries
  getAll: protectedProcedure
    .input(
      z.object({
        status: z.enum(["all", "new", "in_progress", "resolved"]).optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select({
          id: inquiries.id,
          name: inquiries.name,
          email: inquiries.email,
          company: inquiries.company,
          message: inquiries.message,
          status: inquiries.status,
          talentId: inquiries.talentId,
          serviceId: inquiries.serviceId,
          createdAt: inquiries.createdAt,
          updatedAt: inquiries.updatedAt,
        })
        .from(inquiries)
        .orderBy(desc(inquiries.createdAt))

      return results.filter((i) => {
        if (input?.status && input.status !== "all" && i.status !== input.status) return false
        if (input?.search) {
          const s = input.search.toLowerCase()
          return (
            i.name.toLowerCase().includes(s) ||
            i.email.toLowerCase().includes(s) ||
            (i.company?.toLowerCase().includes(s) ?? false)
          )
        }
        return true
      })
    }),

  // Admin — get single inquiry
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(inquiries)
        .where(eq(inquiries.id, input.id))
        .limit(1)
      return result[0] ?? null
    }),

  // Admin — update status
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        status: z.enum(["new", "in_progress", "resolved"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .update(inquiries)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(inquiries.id, input.id))
        .returning()
      return result[0]
    }),

  // Admin — delete inquiry
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(inquiries).where(eq(inquiries.id, input.id))
      return { success: true }
    }),

  // Admin — counts for tabs
  getCounts: protectedProcedure.query(async ({ ctx }) => {
    const all = await ctx.db.select().from(inquiries)
    return {
      all: all.length,
      new: all.filter((i) => i.status === "new").length,
      in_progress: all.filter((i) => i.status === "in_progress").length,
      resolved: all.filter((i) => i.status === "resolved").length,
    }
  }),
})