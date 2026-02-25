import {
  pgTable,
  text,
  timestamp,
  uuid,
  pgEnum,
  integer,
  decimal,
  boolean,
  numeric,
  jsonb,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { LineItem } from "@/types/invoice"

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

export const inquiryPriorityEnum = pgEnum("inquiry_priority", [
  "low",
  "medium",
  "high",
  "urgent",
])

export const inquirySourceEnum = pgEnum("inquiry_source", [
  "contact_form",
  "referral",
  "social_media",
  "direct",
  "other",
])

export const clientTypeEnum = pgEnum("client_type", [
  "company",
  "individual",
])

export const clientStatusEnum = pgEnum("client_status", [
  "active",
  "prospect",
  "inactive",
])

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "paid", "unpaid", "overdue", "partial", "draft"
])

export const activityTypeEnum = pgEnum("activity_type", [
  // Admin actions
  "admin_created",
  "admin_updated",
  "admin_deleted",

  // Talent
  "talent_created",
  "talent_updated",
  "talent_deleted",

  // Inquiry
  "inquiry_received",
  "inquiry_status_changed",
  "inquiry_assigned",
  "inquiry_resolved",

  // Client ← add these
  "client_created",
  "client_updated",
  "client_deleted",
  "client_status_changed",

  // Invoice
  "invoice_created",
  "invoice_sent",
  "invoice_paid",
  "invoice_overdue",
  "invoice_disputed",

  // Support tickets
  "ticket_opened",
  "ticket_replied",
  "ticket_resolved",
  "ticket_status_changed",

  // Portal
  "portal_login",
  "portal_invoice_viewed",
  "portal_project_viewed",

  // Auth
  "auth_sign_in",
  "auth_sign_out",

  // Services
  "service_created",
  "service_updated",
  "service_deleted",

  // Placements
  "placement_created",
  "placement_updated",
  "placement_completed",
  "placement_terminated",
  "placement_on_hold",
  "placement_deleted",
])

export const activityActorEnum = pgEnum("activity_actor", [
  "admin",
  "client",
  "system",
])

export const placementStatusEnum = pgEnum("placement_status", [
  "active",
  "completed",
  "terminated",
  "on_hold",
  "cancelled",
])

export const projectStatusEnum = pgEnum("project_status", [
  "draft",
  "active",
  "paused",
  "completed",
  "cancelled",
])

export const projectPriorityEnum = pgEnum("project_priority", [
  "low",
  "medium",
  "high",
  "urgent",
])

export const contractStatusEnum = pgEnum("contract_status", [
  "pending",
  "sent",
  "signed",
  "rejected",
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
  clerkUserId: text("clerk_user_id").unique(),
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
  phone: text("phone"),
  clientId: uuid("client_id").references(() => clients.id, { onDelete: "set null" }),
  company: text("company"),
  message: text("message").notNull(),
  status: inquiryStatusEnum("status").default("new").notNull(),
  priority: inquiryPriorityEnum("priority").default("medium").notNull(),
  source: inquirySourceEnum("source").default("contact_form").notNull(),
  budget: text("budget"),
  talentId: uuid("talent_id").references(() => talent.id, { onDelete: "set null" }),
  serviceId: uuid("service_id").references(() => services.id, { onDelete: "set null" }),
  assignedTo: uuid("assigned_to").references(() => admins.id, { onDelete: "set null" }),
  notes: text("notes"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ============================================================
// CLIENTS
// ============================================================

export const clients = pgTable("clients", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id").unique(),
  type: clientTypeEnum("type").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  website: text("website"),
  location: text("location"),
  company: text("company"),
  position: text("position"),
  status: clientStatusEnum("status").default("prospect").notNull(),

  services: text("services").array().default([]).notNull(),
  notes: text("notes"),
  joinedDate: timestamp("joined_date").defaultNow().notNull(),
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
// INVOICES
// ============================================================

export const invoices = pgTable("invoices", {
  id: uuid("id").defaultRandom().primaryKey(),
  number: text("number").notNull().unique(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  project: text("project").notNull(),
  clientId: uuid("client_id").notNull().references(() => clients.id),
  issued: text("issued").notNull(),
  due: text("due").notNull(),
  amount: numeric("amount").notNull(),
  paid: numeric("paid").notNull().default("0"),
  status: invoiceStatusEnum("status").notNull().default("unpaid"),
  items: jsonb("items").notNull().$type<LineItem[]>(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// ============================================================
// ACTIVITY LOGS
// ============================================================

export const activityLogs = pgTable("activity_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  actorType: activityActorEnum("actor_type").notNull(),
  actorId: text("actor_id").notNull(),
  actorName: text("actor_name").notNull(),
  type: activityTypeEnum("type").notNull(),
  summary: text("summary").notNull(),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  entityLabel: text("entity_label"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ============================================================
// PLACEMENTS
// ============================================================

export const placements = pgTable("placements", {
  id: uuid("id").defaultRandom().primaryKey(),
  talentId: uuid("talent_id").notNull().references(() => talent.id, { onDelete: "cascade" }),
  clientId: uuid("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  inquiryId: uuid("inquiry_id").references(() => inquiries.id, { onDelete: "set null" }),
  role: text("role").notNull(),
  description: text("description"),
  status: placementStatusEnum("status").default("active").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  hoursPerWeek: integer("hours_per_week").default(40),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ============================================================
//  PROJECTS
// ============================================================

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),

  clientId: uuid("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  inquiryId: uuid("inquiry_id").references(() => inquiries.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  description: text("description"),
  status: projectStatusEnum("status").default("draft").notNull(),
  priority: projectPriorityEnum("priority").default("medium").notNull(),
  progress: integer("progress").default(0),
  contractStatus: contractStatusEnum("contract_status").default("pending").notNull(),
  contractUrl: text("contract_url"),
  contractSignedAt: timestamp("contract_signed_at"),
  startDate: timestamp("start_date"),
  dueDate: timestamp("due_date"),
  budget: decimal("budget", { precision: 12, scale: 2 }),
  spent: decimal("spent", { precision: 12, scale: 2 }).default("0"),
  tags: text("tags").array().default([]),
  milestones: jsonb("milestones")
    .$type<{ label: string; done: boolean }[]>()
    .default([]),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ============================================================
// RELATIONS
// ============================================================

export const projectsRelations = relations(projects, ({ one, many }) => ({
  client: one(clients, { fields: [projects.clientId], references: [clients.id] }),
  inquiry: one(inquiries, { fields: [projects.inquiryId], references: [inquiries.id] }),
  placements: many(placements),
  invoices: many(invoices),
}))

export const talentRelations = relations(talent, ({ many }) => ({
  inquiries: many(inquiries),
  placements: many(placements),
}))

export const clientsRelations = relations(clients, ({ many }) => ({
  inquiries: many(inquiries),
  placements: many(placements),
}))

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  talent: one(talent, { fields: [inquiries.talentId], references: [talent.id] }),
  service: one(services, { fields: [inquiries.serviceId], references: [services.id] }),
  placement: one(placements, { fields: [inquiries.id], references: [placements.inquiryId] }),
  assignedTo: one(admins, { fields: [inquiries.assignedTo], references: [admins.id] }),
}))

// new
export const placementsRelations = relations(placements, ({ one }) => ({
  talent: one(talent, { fields: [placements.talentId], references: [talent.id] }),
  client: one(clients, { fields: [placements.clientId], references: [clients.id] }),
  inquiry: one(inquiries, { fields: [placements.inquiryId], references: [inquiries.id] }),
}))

// ============================================================
// TYPES
// ============================================================

export type AdminRow = typeof admins.$inferSelect
export type NewAdminRow = typeof admins.$inferInsert

export type TalentRow = typeof talent.$inferSelect
export type NewTalentRow = typeof talent.$inferInsert

export type ServiceRow = typeof services.$inferSelect
export type NewServiceRow = typeof services.$inferInsert

export type Inquiry = typeof inquiries.$inferSelect
export type NewInquiry = typeof inquiries.$inferInsert

export type SiteSettingRow = typeof siteSettings.$inferSelect
export type NewSiteSettingRow = typeof siteSettings.$inferInsert

export type ClientRow = typeof clients.$inferSelect
export type NewClientRow = typeof clients.$inferInsert

export type ActivityLog = typeof activityLogs.$inferSelect
export type NewActivityLog = typeof activityLogs.$inferInsert

export type Placement = typeof placements.$inferSelect
export type NewPlacement = typeof placements.$inferInsert

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type Milestone = { label: string; done: boolean }