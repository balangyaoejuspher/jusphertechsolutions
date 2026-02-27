CREATE TYPE "public"."announcement_audience" AS ENUM('all', 'clients', 'talents');--> statement-breakpoint
CREATE TYPE "public"."announcement_recipient_type" AS ENUM('client', 'talent');--> statement-breakpoint
CREATE TYPE "public"."announcement_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."announcement_type" AS ENUM('general', 'maintenance', 'new_feature', 'urgent', 'event');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('inquiry', 'talent', 'invoice', 'client', 'placement', 'system');--> statement-breakpoint
CREATE TABLE "announcement_reads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"announcement_id" uuid NOT NULL,
	"recipient_id" text NOT NULL,
	"recipient_type" "announcement_recipient_type" NOT NULL,
	"read_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"type" "announcement_type" DEFAULT 'general' NOT NULL,
	"audience" "announcement_audience" DEFAULT 'all' NOT NULL,
	"status" "announcement_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" uuid NOT NULL,
	"type" "notification_type" NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"entity_id" text,
	"entity_type" text,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "announcement_reads" ADD CONSTRAINT "announcement_reads_announcement_id_announcements_id_fk" FOREIGN KEY ("announcement_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_created_by_admins_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_admin_id_admins_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "announcement_reads_unique_idx" ON "announcement_reads" USING btree ("announcement_id","recipient_id");--> statement-breakpoint
CREATE INDEX "announcement_reads_announcement_id_idx" ON "announcement_reads" USING btree ("announcement_id");--> statement-breakpoint
CREATE INDEX "announcement_reads_recipient_id_idx" ON "announcement_reads" USING btree ("recipient_id");--> statement-breakpoint
CREATE INDEX "announcements_status_idx" ON "announcements" USING btree ("status");--> statement-breakpoint
CREATE INDEX "announcements_audience_idx" ON "announcements" USING btree ("audience");--> statement-breakpoint
CREATE INDEX "announcements_created_by_idx" ON "announcements" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "notifications_admin_id_idx" ON "notifications" USING btree ("admin_id");--> statement-breakpoint
CREATE INDEX "notifications_read_idx" ON "notifications" USING btree ("read");--> statement-breakpoint
CREATE INDEX "notifications_created_at_idx" ON "notifications" USING btree ("created_at");