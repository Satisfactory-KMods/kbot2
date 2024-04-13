CREATE TABLE IF NOT EXISTS "kbot2"."discord_guild_configuration_blacklisted_mods" (
	"guild_id" numeric NOT NULL,
	"mod_reference" numeric NOT NULL,
	CONSTRAINT "discord_guild_configuration_blacklisted_mods_guild_id_mod_reference_pk" PRIMARY KEY("guild_id","mod_reference")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."discord_guild_configuration_ficsit_user_ids" (
	"guild_id" numeric NOT NULL,
	"ficsit_user_id" numeric NOT NULL,
	CONSTRAINT "discord_guild_configuration_ficsit_user_ids_guild_id_ficsit_user_id_pk" PRIMARY KEY("guild_id","ficsit_user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."discord_guild_configuration_mod_roles" (
	"guild_id" numeric NOT NULL,
	"mod_reference" numeric NOT NULL,
	"role_id" numeric NOT NULL,
	CONSTRAINT "discord_guild_configuration_mod_roles_guild_id_mod_reference_pk" PRIMARY KEY("guild_id","mod_reference")
);
--> statement-breakpoint
DROP TABLE "kbot2"."discord_guild_patreon_settings";--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild_configuration" DROP CONSTRAINT "discord_guild_configuration_pkey";--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild_releases" DROP CONSTRAINT "discord_guild_releases_pkey";--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild_releases" ADD PRIMARY KEY ("file");--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild_configuration" ADD CONSTRAINT "discord_guild_configuration_guild_id_pk" PRIMARY KEY("guild_id");--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild_configuration" ADD COLUMN "patreon_ping_roles" json DEFAULT '[]'::json NOT NULL;--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild_configuration" ADD COLUMN "patreon_release_text" varchar(8196) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild_configuration" ADD COLUMN "patreon_announcement_channel_id" numeric DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild_configuration" ADD COLUMN "patreon_changelog_forum" numeric DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild_configuration" ADD COLUMN "public_ping_roles" json DEFAULT '[]'::json NOT NULL;--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild_configuration" ADD COLUMN "public_announcement_channel_id" numeric DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild_configuration" ADD COLUMN "public_changelog_forum" numeric DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild_configuration" ADD COLUMN "public_release_text" varchar(8196) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild_configuration" DROP COLUMN IF EXISTS "blacklisted_mods";--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild_configuration" DROP COLUMN IF EXISTS "ficsit_user_ids";--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild_configuration" DROP COLUMN IF EXISTS "mod_roles_map";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kbot2"."discord_guild_configuration_blacklisted_mods" ADD CONSTRAINT "discord_guild_configuration_blacklisted_mods_guild_id_discord_guild_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "kbot2"."discord_guild"("guild_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kbot2"."discord_guild_configuration_ficsit_user_ids" ADD CONSTRAINT "discord_guild_configuration_ficsit_user_ids_guild_id_discord_guild_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "kbot2"."discord_guild"("guild_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kbot2"."discord_guild_configuration_mod_roles" ADD CONSTRAINT "discord_guild_configuration_mod_roles_guild_id_discord_guild_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "kbot2"."discord_guild"("guild_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
