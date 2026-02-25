CREATE TYPE "public"."inquiry_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."inquiry_source" AS ENUM('contact_form', 'referral', 'social_media', 'direct', 'other');--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "priority" "inquiry_priority" DEFAULT 'medium' NOT NULL;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "source" "inquiry_source" DEFAULT 'contact_form' NOT NULL;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "budget" text;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "assigned_to" uuid;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "resolved_at" timestamp;--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_assigned_to_admins_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;