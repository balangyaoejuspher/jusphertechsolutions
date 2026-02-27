ALTER TABLE "announcements" ADD COLUMN "email_sent" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "announcements" ADD COLUMN "email_sent_at" timestamp;