CREATE TABLE "admin_notification_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"new_inquiry" boolean DEFAULT true NOT NULL,
	"talent_update" boolean DEFAULT true NOT NULL,
	"weekly_report" boolean DEFAULT false NOT NULL,
	"marketing" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_notification_preferences_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
CREATE TABLE "company_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" text DEFAULT 'Juspher & Co.' NOT NULL,
	"email" text DEFAULT 'support@juspherandco.com' NOT NULL,
	"phone" text,
	"website" text,
	"description" text,
	"address" text,
	"logo_url" text,
	"timezone" text DEFAULT 'Asia/Manila' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admins" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "admin_notification_preferences" ADD CONSTRAINT "admin_notification_preferences_clerk_user_id_admins_clerk_user_id_fk" FOREIGN KEY ("clerk_user_id") REFERENCES "public"."admins"("clerk_user_id") ON DELETE cascade ON UPDATE no action;