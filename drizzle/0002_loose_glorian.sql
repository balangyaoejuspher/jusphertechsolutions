CREATE TYPE "public"."inquiry_status" AS ENUM('new', 'in_progress', 'resolved');--> statement-breakpoint
CREATE TYPE "public"."service_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."talent_role" AS ENUM('developer', 'va', 'project_manager');--> statement-breakpoint
CREATE TYPE "public"."talent_status" AS ENUM('available', 'busy', 'unavailable');--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"icon" text DEFAULT 'Code2' NOT NULL,
	"tags" text[] DEFAULT '{}',
	"status" "service_status" DEFAULT 'active' NOT NULL,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
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
ALTER TABLE "inquiries" DROP CONSTRAINT "inquiries_talent_id_talent_id_fk";
--> statement-breakpoint
ALTER TABLE "talent" ALTER COLUMN "role" SET DATA TYPE "public"."talent_role" USING "role"::text::"public"."talent_role";--> statement-breakpoint
ALTER TABLE "talent" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "talent" ALTER COLUMN "status" SET DATA TYPE "public"."talent_status" USING "status"::text::"public"."talent_status";--> statement-breakpoint
ALTER TABLE "talent" ALTER COLUMN "status" SET DEFAULT 'available';--> statement-breakpoint
ALTER TABLE "talent" ALTER COLUMN "skills" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "talent" ALTER COLUMN "hourly_rate" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "status" "inquiry_status" DEFAULT 'new' NOT NULL;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "service_id" uuid;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "talent" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "talent" ADD COLUMN "gradient" text DEFAULT 'from-blue-500 to-cyan-400';--> statement-breakpoint
ALTER TABLE "talent" ADD COLUMN "rating" numeric(3, 1) DEFAULT '5.0';--> statement-breakpoint
ALTER TABLE "talent" ADD COLUMN "projects_completed" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "talent" ADD COLUMN "is_visible" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_talent_id_talent_id_fk" FOREIGN KEY ("talent_id") REFERENCES "public"."talent"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
DROP TYPE "public"."role";--> statement-breakpoint
DROP TYPE "public"."status";