-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "stock" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ammount" integer,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone,
	"is_deleted" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"user_deleted" text,
	"item-variant" uuid DEFAULT gen_random_uuid()
);
--> statement-breakpoint
ALTER TABLE "stock" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "material" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar NOT NULL,
	"name" varchar,
	"description" varchar,
	"status" smallint,
	"is_deleted" boolean,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"user_deleted" text,
	CONSTRAINT "material_code_key" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "material" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "machine" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar NOT NULL,
	"name" varchar,
	"description" varchar,
	"status" smallint,
	"is_deleted" boolean,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"user_deleted" text,
	CONSTRAINT "machine_code_key" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "machine" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "size" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar NOT NULL,
	"name" varchar,
	"description" varchar,
	"status" smallint,
	"is_deleted" boolean,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"user_deleted" text,
	CONSTRAINT "size_code_key" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "size" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "color" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar NOT NULL,
	"name" varchar,
	"description" varchar,
	"status" smallint,
	"is_deleted" boolean,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"user_deleted" text,
	CONSTRAINT "color_code_key" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "color" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "kaos-kaki" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar,
	"name" varchar,
	"description" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone,
	"is_deleted" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"user_deleted" text,
	"material" uuid,
	CONSTRAINT "kaos-kaki_code_key" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "kaos-kaki" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "item-variant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone,
	"is_deleted" boolean,
	"deleted_at" timestamp with time zone,
	"color" uuid,
	"size" uuid,
	"user_deleted" text,
	"item" uuid
);
--> statement-breakpoint
ALTER TABLE "item-variant" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "item-machine" (
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone,
	"is_deleted" timestamp with time zone,
	"deleted-at" timestamp with time zone,
	"user_deleted" varchar,
	"machine" uuid,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item" uuid,
	CONSTRAINT "item-machine_id_key" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "item-machine" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "stock" ADD CONSTRAINT "stock_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."item-variant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kaos-kaki" ADD CONSTRAINT "kaos-kaki_material_fkey" FOREIGN KEY ("material") REFERENCES "public"."material"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "item-variant" ADD CONSTRAINT "item-variant_item_fkey" FOREIGN KEY ("item") REFERENCES "public"."kaos-kaki"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item-variant" ADD CONSTRAINT "item-variation_color_fkey" FOREIGN KEY ("color") REFERENCES "public"."color"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "item-variant" ADD CONSTRAINT "item-variation_size_fkey" FOREIGN KEY ("size") REFERENCES "public"."size"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "item-machine" ADD CONSTRAINT "item-machine_item_fkey" FOREIGN KEY ("item") REFERENCES "public"."kaos-kaki"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item-machine" ADD CONSTRAINT "item-machine_machine_fkey" FOREIGN KEY ("machine") REFERENCES "public"."machine"("id") ON DELETE restrict ON UPDATE restrict;
*/