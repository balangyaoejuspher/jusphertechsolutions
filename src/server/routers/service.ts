import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/trpc"
import { services, inquiries } from "@/server/db/schema"
import { eq, desc, asc } from "drizzle-orm"

export const serviceRouter = createTRPCRouter({
  // Public — get all active services
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(services)
      .where(eq(services.status, "active"))
      .orderBy(asc(services.order))
  }),

  // Admin — get all services including inactive
  getAllAdmin: protectedProcedure.query(async ({ ctx }) => {
    const allServices = await ctx.db
      .select()
      .from(services)
      .orderBy(asc(services.order))

    // Get inquiry counts per service
    const allInquiries = await ctx.db.select().from(inquiries)

    return allServices.map((s) => ({
      ...s,
      inquiryCount: allInquiries.filter((i) => i.serviceId === s.id).length,
    }))
  }),

  // Create service
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        icon: z.string().default("Code2"),
        tags: z.array(z.string()).default([]),
        status: z.enum(["active", "inactive"]).default("active"),
        order: z.number().default(0),
        category: z.enum(["Development", "Outsourcing"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.insert(services).values(input as any).returning()
      return result[0]
    }),

  // Update service
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().optional(),
        description: z.string().optional(),
        icon: z.string().optional(),
        tags: z.array(z.string()).optional(),
        status: z.enum(["active", "inactive"]).optional(),
        order: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      const result = await ctx.db
        .update(services)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(services.id, id))
        .returning()
      return result[0]
    }),

  // Toggle active/inactive
  toggleStatus: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db
        .select()
        .from(services)
        .where(eq(services.id, input.id))
        .limit(1)

      if (!existing[0]) throw new Error("Service not found")

      const newStatus = existing[0].status === "active" ? "inactive" : "active"

      const result = await ctx.db
        .update(services)
        .set({ status: newStatus, updatedAt: new Date() })
        .where(eq(services.id, input.id))
        .returning()
      return result[0]
    }),

  // Delete service
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(services).where(eq(services.id, input.id))
      return { success: true }
    }),
})