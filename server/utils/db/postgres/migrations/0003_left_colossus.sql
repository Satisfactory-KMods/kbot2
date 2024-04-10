ALTER TABLE "kbot2"."discord_guild" ADD COLUMN IF NOT EXISTS "total_members" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild" ADD COLUMN IF NOT EXISTS "guild_created" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild" ADD COLUMN IF NOT EXISTS "name" varchar(512) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild" ADD COLUMN IF NOT EXISTS "owner_id" varchar(512) DEFAULT '0' NOT NULL;