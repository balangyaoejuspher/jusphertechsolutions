import { pgTable, text, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core"

export const roleEnum = pgEnum("role", ["developer", "va", "project_manager"])
export const statusEnum = pgEnum("status", ["available", "unavailable", "busy"])

export const talent = pgTable("talent", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: roleEnum("role").notNull(),
  status: statusEnum("status").default("available").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  skills: text("skills").array(),
  hourlyRate: text("hourly_rate"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const inquiries = pgTable("inquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  message: text("message").notNull(),
  talentId: uuid("talent_id").references(() => talent.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})