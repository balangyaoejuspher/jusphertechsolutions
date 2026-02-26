CREATE TYPE "public"."activity_actor" AS ENUM('admin', 'client', 'system');--> statement-breakpoint
CREATE TYPE "public"."activity_type" AS ENUM('admin_created', 'admin_updated', 'admin_deleted', 'talent_created', 'talent_updated', 'talent_deleted', 'inquiry_received', 'inquiry_status_changed', 'inquiry_assigned', 'inquiry_resolved', 'client_created', 'client_updated', 'client_deleted', 'client_status_changed', 'invoice_created', 'invoice_sent', 'invoice_paid', 'invoice_overdue', 'invoice_disputed', 'ticket_opened', 'ticket_replied', 'ticket_resolved', 'ticket_status_changed', 'portal_login', 'portal_invoice_viewed', 'portal_project_viewed', 'auth_sign_in', 'auth_sign_out', 'service_created', 'service_updated', 'service_deleted', 'placement_created', 'placement_updated', 'placement_completed', 'placement_terminated', 'placement_on_hold', 'placement_deleted');--> statement-breakpoint
CREATE TYPE "public"."admin_role" AS ENUM('super_admin', 'admin', 'editor');--> statement-breakpoint
CREATE TYPE "public"."client_status" AS ENUM('active', 'prospect', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."client_type" AS ENUM('company', 'individual');--> statement-breakpoint
CREATE TYPE "public"."contract_status" AS ENUM('pending', 'sent', 'signed', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."inquiry_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."inquiry_source" AS ENUM('contact_form', 'referral', 'social_media', 'direct', 'other');--> statement-breakpoint
CREATE TYPE "public"."inquiry_status" AS ENUM('new', 'in_progress', 'resolved');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('paid', 'unpaid', 'overdue', 'partial', 'draft');--> statement-breakpoint
CREATE TYPE "public"."placement_status" AS ENUM('active', 'completed', 'terminated', 'on_hold', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."project_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('draft', 'active', 'paused', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."service_category" AS ENUM('development', 'outsourcing');--> statement-breakpoint
CREATE TYPE "public"."service_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."talent_role" AS ENUM('developer', 'va', 'project_manager', 'designer', 'ui_ux', 'data_analyst', 'content_writer', 'marketing', 'customer_support', 'accountant', 'video_editor', 'seo_specialist');--> statement-breakpoint
CREATE TYPE "public"."talent_status" AS ENUM('available', 'busy', 'unavailable');--> statement-breakpoint
CREATE TABLE "activity_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_type" "activity_actor" NOT NULL,
	"actor_id" text NOT NULL,
	"actor_name" text NOT NULL,
	"type" "activity_type" NOT NULL,
	"summary" text NOT NULL,
	"entity_type" text,
	"entity_id" text,
	"entity_label" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"role" "admin_role" DEFAULT 'editor' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admins_clerk_user_id_unique" UNIQUE("clerk_user_id"),
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text,
	"type" "client_type" NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"website" text,
	"location" text,
	"company" text,
	"position" text,
	"status" "client_status" DEFAULT 'prospect' NOT NULL,
	"services" text[] DEFAULT '{}' NOT NULL,
	"notes" text,
	"joined_date" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clients_clerk_user_id_unique" UNIQUE("clerk_user_id"),
	CONSTRAINT "clients_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"client_id" uuid,
	"company" text,
	"message" text NOT NULL,
	"status" "inquiry_status" DEFAULT 'new' NOT NULL,
	"priority" "inquiry_priority" DEFAULT 'medium' NOT NULL,
	"source" "inquiry_source" DEFAULT 'contact_form' NOT NULL,
	"budget" text,
	"talent_id" uuid,
	"service_id" uuid,
	"assigned_to" uuid,
	"notes" text,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"number" text NOT NULL,
	"project_id" uuid,
	"project" text NOT NULL,
	"client_id" uuid NOT NULL,
	"issued" text NOT NULL,
	"due" text NOT NULL,
	"amount" numeric NOT NULL,
	"paid" numeric DEFAULT '0' NOT NULL,
	"status" "invoice_status" DEFAULT 'unpaid' NOT NULL,
	"items" jsonb NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "invoices_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE "placements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"talent_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"project_id" uuid,
	"inquiry_id" uuid,
	"role" text NOT NULL,
	"description" text,
	"status" "placement_status" DEFAULT 'active' NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"hourly_rate" numeric(10, 2),
	"hours_per_week" integer DEFAULT 40,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"inquiry_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"status" "project_status" DEFAULT 'draft' NOT NULL,
	"priority" "project_priority" DEFAULT 'medium' NOT NULL,
	"progress" integer DEFAULT 0,
	"contract_status" "contract_status" DEFAULT 'pending' NOT NULL,
	"contract_url" text,
	"contract_signed_at" timestamp,
	"start_date" timestamp,
	"due_date" timestamp,
	"budget" numeric(12, 2),
	"spent" numeric(12, 2) DEFAULT '0',
	"tags" text[] DEFAULT '{}',
	"milestones" jsonb DEFAULT '[]'::jsonb,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text,
	"icon" text DEFAULT 'Code2' NOT NULL,
	"number" text DEFAULT '01' NOT NULL,
	"title" text NOT NULL,
	"tagline" text DEFAULT '' NOT NULL,
	"description" text NOT NULL,
	"long_description" text,
	"features" text[] DEFAULT '{}',
	"stack" text[] DEFAULT '{}',
	"category" "service_category" NOT NULL,
	"featured" boolean DEFAULT false,
	"badge" text,
	"status" "service_status" DEFAULT 'active' NOT NULL,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"value" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "site_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "talent" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"title" text NOT NULL,
	"role" "talent_role" NOT NULL,
	"status" "talent_status" DEFAULT 'available' NOT NULL,
	"bio" text,
	"avatar_url" text,
	"gradient" text DEFAULT 'from-blue-500 to-cyan-400',
	"skills" text[] DEFAULT '{}',
	"hourly_rate" numeric(10, 2),
	"rating" numeric(3, 1) DEFAULT '5.0',
	"projects_completed" integer DEFAULT 0,
	"is_visible" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "talent_clerk_user_id_unique" UNIQUE("clerk_user_id"),
	CONSTRAINT "talent_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_talent_id_talent_id_fk" FOREIGN KEY ("talent_id") REFERENCES "public"."talent"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_assigned_to_admins_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placements" ADD CONSTRAINT "placements_talent_id_talent_id_fk" FOREIGN KEY ("talent_id") REFERENCES "public"."talent"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placements" ADD CONSTRAINT "placements_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placements" ADD CONSTRAINT "placements_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placements" ADD CONSTRAINT "placements_inquiry_id_inquiries_id_fk" FOREIGN KEY ("inquiry_id") REFERENCES "public"."inquiries"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_inquiry_id_inquiries_id_fk" FOREIGN KEY ("inquiry_id") REFERENCES "public"."inquiries"("id") ON DELETE set null ON UPDATE no action;