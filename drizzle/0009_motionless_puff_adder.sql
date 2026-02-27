ALTER TYPE "public"."announcement_status" ADD VALUE 'scheduled' BEFORE 'archived';--> statement-breakpoint
ALTER TABLE "announcements" ADD COLUMN "scheduled_at" timestamp;--> statement-breakpoint
CREATE INDEX "announcements_scheduled_at_idx" ON "announcements" USING btree ("scheduled_at");