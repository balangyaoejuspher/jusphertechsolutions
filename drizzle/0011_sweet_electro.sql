CREATE TYPE "public"."contract_doc_status" AS ENUM('draft', 'sent', 'signed', 'expired', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."contract_type" AS ENUM('service_agreement', 'nda', 'retainer', 'scope_of_work', 'placement');--> statement-breakpoint
CREATE TABLE "contract_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" "contract_type" DEFAULT 'service_agreement' NOT NULL,
	"body" text NOT NULL,
	"is_default" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contracts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" uuid,
	"project_id" uuid,
	"client_id" uuid NOT NULL,
	"title" text NOT NULL,
	"type" "contract_type" DEFAULT 'service_agreement' NOT NULL,
	"status" "contract_doc_status" DEFAULT 'draft' NOT NULL,
	"body" text NOT NULL,
	"pdf_url" text,
	"storage_path" text,
	"signer_name" text,
	"signer_email" text,
	"sent_at" timestamp,
	"signed_at" timestamp,
	"expires_at" timestamp,
	"variables" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "talent" ADD COLUMN "is_vetted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_template_id_contract_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."contract_templates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;