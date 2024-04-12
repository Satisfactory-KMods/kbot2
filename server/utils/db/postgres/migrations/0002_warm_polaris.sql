CREATE SCHEMA "ficsit_app";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."downloads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"version" varchar(64) NOT NULL,
	"guild_id" numeric NOT NULL,
	"mod_reference" varchar(128) NOT NULL,
	"patreon" boolean DEFAULT false NOT NULL,
	"uploaded_by" numeric NOT NULL,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"changelog" text NOT NULL,
	CONSTRAINT "downloads_version_mod_reference_unique" UNIQUE("version","mod_reference")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ficsit_app"."mod_authors" (
	"mod_id" varchar(128) NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"role" varchar(32) NOT NULL,
	"name" varchar(128) NOT NULL,
	CONSTRAINT "mod_authors_mod_id_user_id_pk" PRIMARY KEY("mod_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ficsit_app"."mod_cache" (
	"mod_id" varchar(128) PRIMARY KEY NOT NULL,
	"mod_reference" varchar(128) NOT NULL,
	"name" varchar(128) NOT NULL,
	"logo" varchar(1024) NOT NULL,
	"source_url" varchar(1024) NOT NULL,
	"short_description" varchar(512) NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"creator_id" varchar(128) NOT NULL,
	"downloads" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_version_at" timestamp with time zone DEFAULT now() NOT NULL,
	"hidden" boolean DEFAULT false NOT NULL,
	"last_version_date" timestamp with time zone,
	"last_versions" json DEFAULT '{}'::json NOT NULL,
	CONSTRAINT "mod_cache_mod_reference_unique" UNIQUE("mod_reference")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ficsit_app"."mod_versions" (
	"mod_id" varchar(128) NOT NULL,
	"id" varchar(128) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"changelog" text NOT NULL,
	"hash" varchar(64) NOT NULL,
	"version" varchar(64) NOT NULL,
	"sml_version" varchar(64) NOT NULL,
	CONSTRAINT "mod_versions_mod_id_id_pk" PRIMARY KEY("mod_id","id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."mod_updates" (
	"guild_id" numeric NOT NULL,
	"mod_reference" varchar(128) NOT NULL,
	"version" varchar(64) NOT NULL,
	"announced" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mod_updates_guild_id_mod_reference_pk" PRIMARY KEY("guild_id","mod_reference")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "downloads_mod_reference_index" ON "kbot2"."downloads" ("mod_reference");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kbot2"."downloads" ADD CONSTRAINT "downloads_guild_id_discord_guild_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "kbot2"."discord_guild"("guild_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kbot2"."mod_updates" ADD CONSTRAINT "mod_updates_guild_id_discord_guild_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "kbot2"."discord_guild"("guild_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
