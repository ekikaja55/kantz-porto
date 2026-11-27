CREATE TABLE "experiences" (
	"id" text PRIMARY KEY NOT NULL,
	"period" text NOT NULL,
	"company" text NOT NULL,
	"role" text NOT NULL,
	"description" text NOT NULL,
	"highlights" text[] DEFAULT '{}' NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" text PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"name" text NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "images" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
CREATE INDEX "experiences_order_idx" ON "experiences" USING btree ("order_index");--> statement-breakpoint
CREATE INDEX "skills_order_idx" ON "skills" USING btree ("order_index");--> statement-breakpoint
CREATE INDEX "projects_published_order_idx" ON "projects" USING btree ("is_published","order_index");--> statement-breakpoint
CREATE INDEX "projects_featured_idx" ON "projects" USING btree ("is_published","tier","order_index");