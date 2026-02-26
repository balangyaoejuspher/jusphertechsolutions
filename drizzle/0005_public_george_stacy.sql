CREATE TYPE "public"."post_category" AS ENUM('Outsourcing', 'Blockchain & Web3', 'Development', 'Products');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('published', 'draft');--> statement-breakpoint
ALTER TYPE "public"."activity_type" ADD VALUE 'post_created';--> statement-breakpoint
ALTER TYPE "public"."activity_type" ADD VALUE 'post_updated';--> statement-breakpoint
ALTER TYPE "public"."activity_type" ADD VALUE 'post_deleted';--> statement-breakpoint
ALTER TYPE "public"."activity_type" ADD VALUE 'post_published';--> statement-breakpoint
ALTER TYPE "public"."activity_type" ADD VALUE 'post_unpublished';--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"category" "post_category" NOT NULL,
	"tag" text,
	"author" text NOT NULL,
	"role" text,
	"read_time" text DEFAULT '5 min read' NOT NULL,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"date" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "posts_status_idx" ON "posts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "posts_category_idx" ON "posts" USING btree ("category");--> statement-breakpoint
CREATE INDEX "posts_search_idx" ON "posts" USING gin ((
      setweight(to_tsvector('english', "title"),   'A') ||
      setweight(to_tsvector('english', "excerpt"), 'B') ||
      setweight(to_tsvector('english', "content"), 'C')
    ));