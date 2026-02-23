CREATE TYPE "public"."client_status" AS ENUM('active', 'prospect', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."client_type" AS ENUM('company', 'individual');--> statement-breakpoint
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
