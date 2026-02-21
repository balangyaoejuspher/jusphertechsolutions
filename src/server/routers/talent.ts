import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/trpc"
import { talent } from "@/server/db/schema"
import { eq, desc, ilike, or } from "drizzle-orm"

export const talentRouter = createTRPCRouter({
  // Public — used on the public talent page
  getAll: publicProcedure
    .input(
      z.object({
        role: z.string().optional(),
        status: z.string().optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db.select().from(talent).orderBy(desc(talent.rating))

      return results.filter((t) => {
        if (!t.isVisible) return false
        if (input?.role && input.role !== "all" && t.role !== input.role) return false
        if (input?.status && input.status !== "all" && t.status !== input.status) return false
        if (input?.search) {
          const s = input.search.toLowerCase()
          return (
            t.name.toLowerCase().includes(s) ||
            t.title?.toLowerCase().includes(s) ||
            t.skills?.some((sk) => sk.toLowerCase().includes(s))
          )
        }
        return true
      })
    }),

  // Admin — get all talent including hidden
  getAllAdmin: protectedProcedure
    .input(
      z.object({
        role: z.string().optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db.select().from(talent).orderBy(desc(talent.createdAt))

      return results.filter((t) => {
        if (input?.role && input.role !== "all" && t.role !== input.role) return false
        if (input?.search) {
          const s = input.search.toLowerCase()
          return (
            t.name.toLowerCase().includes(s) ||
            t.title?.toLowerCase().includes(s)
          )
        }
        return true
      })
    }),

  // Get single talent by ID
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(talent)
        .where(eq(talent.id, input.id))
        .limit(1)
      return result[0] ?? null
    }),

  // Create new talent
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        title: z.string().min(1),
        role: z.enum([
          "developer", "va", "project_manager", "designer", "ui_ux",
          "data_analyst", "content_writer", "marketing", "customer_support",
          "accountant", "video_editor", "seo_specialist",
        ]),
        status: z.enum(["available", "busy", "unavailable"]).default("available"),
        bio: z.string().optional(),
        skills: z.array(z.string()).default([]),
        hourlyRate: z.string().optional(),
        rating: z.string().optional(),
        projectsCompleted: z.number().default(0),
        gradient: z.string().optional(),
        isVisible: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.insert(talent).values(input).returning()
      return result[0]
    }),

  // Update talent
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        title: z.string().optional(),
        role: z.enum([
          "developer", "va", "project_manager", "designer", "ui_ux",
          "data_analyst", "content_writer", "marketing", "customer_support",
          "accountant", "video_editor", "seo_specialist",
        ]).optional(),
        status: z.enum(["available", "busy", "unavailable"]).optional(),
        bio: z.string().optional(),
        skills: z.array(z.string()).optional(),
        hourlyRate: z.string().optional(),
        rating: z.string().optional(),
        projectsCompleted: z.number().optional(),
        gradient: z.string().optional(),
        isVisible: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      const result = await ctx.db
        .update(talent)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(talent.id, id))
        .returning()
      return result[0]
    }),

  // Toggle status
  toggleStatus: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db
        .select()
        .from(talent)
        .where(eq(talent.id, input.id))
        .limit(1)

      if (!existing[0]) throw new Error("Talent not found")

      const newStatus = existing[0].status === "available" ? "busy" : "available"

      const result = await ctx.db
        .update(talent)
        .set({ status: newStatus, updatedAt: new Date() })
        .where(eq(talent.id, input.id))
        .returning()
      return result[0]
    }),

  // Delete talent
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(talent).where(eq(talent.id, input.id))
      return { success: true }
    }),
})