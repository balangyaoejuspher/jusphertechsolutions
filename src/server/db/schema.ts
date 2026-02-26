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
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm"
import { LineItem } from "@/types/invoice"

// ─── Enums ────────────────────────────────────────────────────────────────────

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

export const serviceCategoryEnum = pgEnum("service_category", [
  "development",
  "outsourcing",
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
  "paid", "unpaid", "overdue", "partial", "draft",
])

export const activityTypeEnum = pgEnum("activity_type", [
  "admin_created",
  "admin_updated",
  "admin_deleted",
  "talent_created",
  "talent_updated",
  "talent_deleted",
  "inquiry_received",
  "inquiry_status_changed",
  "inquiry_assigned",
  "inquiry_resolved",
  "client_created",
  "client_updated",
  "client_deleted",
  "client_status_changed",
  "invoice_created",
  "invoice_sent",
  "invoice_paid",
  "invoice_overdue",
  "invoice_disputed",
  "ticket_opened",
  "ticket_replied",
  "ticket_resolved",
  "ticket_status_changed",
  "portal_login",
  "portal_invoice_viewed",
  "portal_project_viewed",
  "auth_sign_in",
  "auth_sign_out",
  "service_created",
  "service_updated",
  "service_deleted",
  "placement_created",
  "placement_updated",
  "placement_completed",
  "placement_terminated",
  "placement_on_hold",
  "placement_deleted",
  "product_created",
  "product_updated",
  "product_deleted",
  "post_created",
  "post_updated",
  "post_deleted",
  "post_published",
  "post_unpublished",
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

export const placementInquiryStatusEnum = pgEnum("placement_inquiry_status", [
  "draft",
  "submitted",
  "under_review",
  "approved",
  "contract_generated",
  "contract_sent",
  "contract_signed",
  "active",
  "rejected",
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

export const productCategoryEnum = pgEnum("product_category", [
  "developer_tools",
  "productivity",
  "analytics",
  "communication",
  "security",
  "other",
])

export const productStatusEnum = pgEnum("product_status", [
  "available",
  "coming_soon",
  "beta",
  "deprecated",
  "maintenance",
])

export const postStatusEnum = pgEnum("post_status", ["published", "draft"])

export const postCategoryEnum = pgEnum("post_category", [
  "Outsourcing",
  "Blockchain & Web3",
  "Development",
  "Products",
])

// ─── Tables ───────────────────────────────────────────────────────────────────

export const admins = pgTable("admins", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: adminRoleEnum("role").default("editor").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

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

export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique(),
  icon: text("icon").notNull().default("Code2"),
  number: text("number").notNull().default("01"),
  title: text("title").notNull(),
  tagline: text("tagline").notNull().default(""),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  features: text("features").array().default([]),
  stack: text("stack").array().default([]),
  category: serviceCategoryEnum("category").notNull(),
  featured: boolean("featured").default(false),
  badge: text("badge"),
  status: serviceStatusEnum("status").default("active").notNull(),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

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

export const siteSettings = pgTable("site_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

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
  milestones: jsonb("milestones").$type<{ label: string; done: boolean }[]>().default([]),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

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

export const placements = pgTable("placements", {
  id: uuid("id").defaultRandom().primaryKey(),
  talentId: uuid("talent_id").notNull().references(() => talent.id, { onDelete: "cascade" }),
  clientId: uuid("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  inquiryId: uuid("inquiry_id").references(() => inquiries.id, { onDelete: "set null" }),
  inquiryStatus: placementInquiryStatusEnum("inquiry_status").default("draft").notNull(),
  contractSentAt: timestamp("contract_sent_at"),
  contractGeneratedAt: timestamp("contract_generated_at"),
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

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  label: text("label").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull().default("Package"),
  accentColor: text("accent_color").notNull().default("#f59e0b"),
  bgColor: text("bg_color").notNull().default("bg-amber-50"),
  borderColor: text("border_color").notNull().default("border-amber-200"),
  textColor: text("text_color").notNull().default("text-amber-600"),
  category: productCategoryEnum("category").notNull().default("other"),
  features: jsonb("features").notNull().default([]),
  pricing: jsonb("pricing").notNull().default([]),
  useCases: text("use_cases").array().default([]),
  techHighlights: text("tech_highlights").array().default([]),
  status: productStatusEnum("status").default("available").notNull(),
  isVisible: boolean("is_visible").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isNew: boolean("is_new").default(false).notNull(),
  badge: text("badge"),
  order: integer("order").default(0),
  launchedAt: timestamp("launched_at"),
  deprecatedAt: timestamp("deprecated_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull().default(""),
  category: postCategoryEnum("category").notNull(),
  tag: text("tag"),
  author: text("author").notNull(),
  role: text("role"),
  readTime: text("read_time").notNull().default("5 min read"),
  status: postStatusEnum("status").notNull().default("draft"),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("posts_slug_idx").on(table.slug),
  index("posts_status_idx").on(table.status),
  index("posts_category_idx").on(table.category),
  index("posts_search_idx").using(
    "gin",
    sql`(
      setweight(to_tsvector('english', ${table.title}),   'A') ||
      setweight(to_tsvector('english', ${table.excerpt}), 'B') ||
      setweight(to_tsvector('english', ${table.content}), 'C')
    )`
  ),
])

// ─── Relations ────────────────────────────────────────────────────────────────

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

export const placementsRelations = relations(placements, ({ one }) => ({
  talent: one(talent, { fields: [placements.talentId], references: [talent.id] }),
  client: one(clients, { fields: [placements.clientId], references: [clients.id] }),
  inquiry: one(inquiries, { fields: [placements.inquiryId], references: [inquiries.id] }),
}))

// ─── Inferred types ───────────────────────────────────────────────────────────

export type AdminRow = typeof admins.$inferSelect
export type NewAdminRow = typeof admins.$inferInsert

export type TalentRow = typeof talent.$inferSelect
export type NewTalentRow = typeof talent.$inferInsert

export type Service = typeof services.$inferSelect
export type NewService = typeof services.$inferInsert

export type Inquiry = typeof inquiries.$inferSelect
export type NewInquiry = typeof inquiries.$inferInsert

export type ClientRow = typeof clients.$inferSelect
export type NewClientRow = typeof clients.$inferInsert

export type SiteSettingRow = typeof siteSettings.$inferSelect
export type NewSiteSettingRow = typeof siteSettings.$inferInsert

export type ActivityLog = typeof activityLogs.$inferSelect
export type NewActivityLog = typeof activityLogs.$inferInsert

export type Placement = typeof placements.$inferSelect
export type NewPlacement = typeof placements.$inferInsert

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type Milestone = { label: string; done: boolean }

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert

export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
export type PostStatus = Post["status"]
export type PostCategory = Post["category"]