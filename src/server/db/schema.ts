import {
  pgTable,
  text,
  timestamp,
  uuid,
  pgEnum,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// ============================================================
// ENUMS
// ============================================================

export const adminRoleEnum = pgEnum("admin_role", [
  "super_admin",
  "admin",
  "editor",
])

export const talentRoleEnum = pgEnum("talent_role", [
  "developer",
  "va",
  "project_manager",
  "designer",
  "ui_ux",
  "data_analyst",
  "content_writer",
  "marketing",
  "customer_support",
  "accountant",
  "video_editor",
  "seo_specialist",
])

export const talentStatusEnum = pgEnum("talent_status", [
  "available",
  "busy",
  "unavailable",
])

export const inquiryStatusEnum = pgEnum("inquiry_status", [
  "new",
  "in_progress",
  "resolved",
])

export const serviceStatusEnum = pgEnum("service_status", [
  "active",
  "inactive",
])

// ============================================================
// ADMINS
// ============================================================

export const admins = pgTable("admins", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: adminRoleEnum("role").default("editor").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ============================================================
// TALENT
// ============================================================

export const talent = pgTable("talent", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  title: text("title").notNull(),
  role: talentRoleEnum("role").notNull(),
  status: talentStatusEnum("status").default("available").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  gradient: text("gradient").default("from-blue-500 to-cyan-400"),
  skills: text("skills").array().default([]),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  rating: decimal("rating", { precision: 3, scale: 1 }).default("5.0"),
  projectsCompleted: integer("projects_completed").default(0),
  isVisible: boolean("is_visible").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ============================================================
// SERVICES
// ============================================================

export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull().default("Code2"),
  tags: text("tags").array().default([]),
  status: serviceStatusEnum("status").default("active").notNull(),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ============================================================
// INQUIRIES
// ============================================================

export const inquiries = pgTable("inquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  message: text("message").notNull(),
  status: inquiryStatusEnum("status").default("new").notNull(),
  talentId: uuid("talent_id").references(() => talent.id, { onDelete: "set null" }),
  serviceId: uuid("service_id").references(() => services.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ============================================================
// SITE SETTINGS
// ============================================================

export const siteSettings = pgTable("site_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ============================================================
// RELATIONS
// ============================================================

export const talentRelations = relations(talent, ({ many }) => ({
  inquiries: many(inquiries),
}))

export const servicesRelations = relations(services, ({ many }) => ({
  inquiries: many(inquiries),
}))

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  talent: one(talent, {
    fields: [inquiries.talentId],
    references: [talent.id],
  }),
  service: one(services, {
    fields: [inquiries.serviceId],
    references: [services.id],
  }),
}))

// ============================================================
// TYPES
// ============================================================

export type Admin = typeof admins.$inferSelect
export type NewAdmin = typeof admins.$inferInsert

export type Talent = typeof talent.$inferSelect
export type NewTalent = typeof talent.$inferInsert

export type Service = typeof services.$inferSelect
export type NewService = typeof services.$inferInsert

export type Inquiry = typeof inquiries.$inferSelect
export type NewInquiry = typeof inquiries.$inferInsert

export type SiteSetting = typeof siteSettings.$inferSelect