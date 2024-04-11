CREATE SCHEMA "kbot2";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp with time zone,
	"image" text,
	"hoster" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."discord_guild_chat_commands" (
	"command_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guild_id" numeric NOT NULL,
	"reaction_text" varchar(2000),
	"auto_reaction_matches" json DEFAULT 'false'::json NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."discord_guild_chat_commands_trigger" (
	"command_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trigger" varchar(64)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."discord_guild" (
	"guild_id" numeric PRIMARY KEY NOT NULL,
	"total_members" integer DEFAULT 0 NOT NULL,
	"guild_created" timestamp with time zone DEFAULT now() NOT NULL,
	"name" varchar(512) DEFAULT '' NOT NULL,
	"owner_id" numeric DEFAULT '0' NOT NULL,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."discord_guild_admins" (
	"guild_id" numeric NOT NULL,
	"user_id" numeric NOT NULL,
	CONSTRAINT "discord_guild_admins_guild_id_user_id_pk" PRIMARY KEY("guild_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."discord_guild_configuration" (
	"guild_id" numeric PRIMARY KEY NOT NULL,
	"changelog_suggestion_channel_id" numeric DEFAULT '0' NOT NULL,
	"changelog_bug_channel_id" numeric DEFAULT '0' NOT NULL,
	"changelog_announce_hidden_mods" boolean DEFAULT false NOT NULL,
	"changelog_forum_id" numeric DEFAULT '0' NOT NULL,
	"update_text_channel_id" numeric DEFAULT '0' NOT NULL,
	"default_ping_role" numeric DEFAULT '0' NOT NULL,
	"blacklisted_mods" json DEFAULT '[]'::json NOT NULL,
	"ficsit_user_ids" json DEFAULT '[]'::json NOT NULL,
	"mod_roles_map" json DEFAULT '[]'::json NOT NULL,
	"chat_command_prefix" char(1) DEFAULT '.' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."discord_guild_patreon_settings" (
	"guild_id" numeric PRIMARY KEY NOT NULL,
	"ping_roles" json DEFAULT '[]'::json NOT NULL,
	"announcement_channel_id" numeric DEFAULT '0' NOT NULL,
	"changelog_forum" numeric DEFAULT '0' NOT NULL,
	"patreon_release_text" varchar(8196) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."discord_guild_patreons" (
	"guild_id" numeric NOT NULL,
	"user_id" numeric NOT NULL,
	CONSTRAINT "discord_guild_patreons_guild_id_user_id_pk" PRIMARY KEY("guild_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."discord_guild_reaction_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guild_id" numeric NOT NULL,
	"channel_id" numeric NOT NULL,
	"message_id" numeric NOT NULL,
	"reactions" json DEFAULT '[]'::json NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."discord_guild_releases" (
	"guild_id" numeric PRIMARY KEY NOT NULL,
	"file" uuid DEFAULT gen_random_uuid() NOT NULL,
	"patreon" boolean DEFAULT false NOT NULL,
	"expires" date,
	"mod_ref" varchar(256) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kbot2"."account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "kbot2"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kbot2"."session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "kbot2"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kbot2"."discord_guild_chat_commands" ADD CONSTRAINT "discord_guild_chat_commands_guild_id_discord_guild_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "kbot2"."discord_guild"("guild_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kbot2"."discord_guild_chat_commands_trigger" ADD CONSTRAINT "discord_guild_chat_commands_trigger_command_id_discord_guild_chat_commands_command_id_fk" FOREIGN KEY ("command_id") REFERENCES "kbot2"."discord_guild_chat_commands"("command_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kbot2"."discord_guild_admins" ADD CONSTRAINT "discord_guild_admins_guild_id_discord_guild_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "kbot2"."discord_guild"("guild_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kbot2"."discord_guild_configuration" ADD CONSTRAINT "discord_guild_configuration_guild_id_discord_guild_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "kbot2"."discord_guild"("guild_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kbot2"."discord_guild_patreon_settings" ADD CONSTRAINT "discord_guild_patreon_settings_guild_id_discord_guild_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "kbot2"."discord_guild"("guild_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kbot2"."discord_guild_patreons" ADD CONSTRAINT "discord_guild_patreons_guild_id_discord_guild_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "kbot2"."discord_guild"("guild_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kbot2"."discord_guild_reaction_roles" ADD CONSTRAINT "discord_guild_reaction_roles_guild_id_discord_guild_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "kbot2"."discord_guild"("guild_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kbot2"."discord_guild_releases" ADD CONSTRAINT "discord_guild_releases_guild_id_discord_guild_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "kbot2"."discord_guild"("guild_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
