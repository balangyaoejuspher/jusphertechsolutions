import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "@/server/trpc"
import { siteSettings } from "@/server/db/schema"
import { eq } from "drizzle-orm"

// Default settings keys
export const SETTINGS_KEYS = {
  AGENCY_NAME: "agency_name",
  EMAIL: "email",
  PHONE: "phone",
  WEBSITE: "website",
  BIO: "bio",
  TIMEZONE: "timezone",
  NOTIFY_NEW_INQUIRY: "notify_new_inquiry",
  NOTIFY_TALENT_UPDATE: "notify_talent_update",
  NOTIFY_WEEKLY_REPORT: "notify_weekly_report",
  NOTIFY_MARKETING: "notify_marketing",
} as const

export const settingsRouter = createTRPCRouter({
  // Get all settings as a key-value map
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const results = await ctx.db.select().from(siteSettings)

    // Convert array to object map for easy access
    return results.reduce(
      (acc, setting) => {
        acc[setting.key] = setting.value ?? ""
        return acc
      },
      {} as Record<string, string>
    )
  }),

  // Get a single setting by key
  get: protectedProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, input.key))
        .limit(1)
      return result[0]?.value ?? null
    }),

  // Upsert a single setting
  set: protectedProcedure
    .input(
      z.object({
        key: z.string(),
        value: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, input.key))
        .limit(1)

      if (existing[0]) {
        await ctx.db
          .update(siteSettings)
          .set({ value: input.value, updatedAt: new Date() })
          .where(eq(siteSettings.key, input.key))
      } else {
        await ctx.db.insert(siteSettings).values({
          key: input.key,
          value: input.value,
        })
      }

      return { success: true }
    }),

  // Upsert multiple settings at once (used by save button)
  setMany: protectedProcedure
    .input(z.record(z.string(), z.string()))
    .mutation(async ({ ctx, input }) => {
      for (const [key, value] of Object.entries(input)) {
        const existing = await ctx.db
          .select()
          .from(siteSettings)
          .where(eq(siteSettings.key, key))
          .limit(1)

        if (existing[0]) {
          await ctx.db
            .update(siteSettings)
            .set({ value, updatedAt: new Date() })
            .where(eq(siteSettings.key, key))
        } else {
          await ctx.db.insert(siteSettings).values({ key, value })
        }
      }

      return { success: true }
    }),
})