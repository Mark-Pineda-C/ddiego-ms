DO $$ BEGIN
 CREATE TYPE "dd_user_role" AS ENUM('seller', 'admin', 'superadmin', 'distributor');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dd_office" (
	"id" text PRIMARY KEY NOT NULL,
	"bearer_token" text,
	"url_token" text,
	"billing_data" jsonb DEFAULT '{"bill":{"count":0,"serial":""},"ticket":{"count":0,"serial":""}}'::jsonb,
	"name" text NOT NULL,
	"address" text,
	"cashbox" integer DEFAULT 0,
	"last_cashbox_update" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dd_product" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"sell_data" jsonb DEFAULT '{"default":{"price":0,"stock":0}}'::jsonb NOT NULL,
	"image" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "dd_user" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "dd_user" ADD COLUMN "role" "dd_user_role" DEFAULT 'seller' NOT NULL;--> statement-breakpoint
ALTER TABLE "dd_user" ADD COLUMN "office_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dd_user" ADD CONSTRAINT "dd_user_office_id_dd_office_id_fk" FOREIGN KEY ("office_id") REFERENCES "dd_office"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
