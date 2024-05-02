CREATE SCHEMA "ficsit_app";
--> statement-breakpoint
CREATE SCHEMA "kbot2";
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "enum_adapter_auth_type" AS ENUM('oauth', 'oidc', 'email', 'webauthn');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "command_trigger_match_type" AS ENUM('prefix', 'fuzzy', 'regex');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."account" (
	"userId" bigint NOT NULL,
	"type" "enum_adapter_auth_type" NOT NULL,
	"provider" varchar(1024) NOT NULL,
	"providerAccountId" bigint NOT NULL,
	"refresh_token" varchar(1024),
	"access_token" varchar(1024),
	"expires_at" timestamp with time zone,
	"token_type" varchar(1024),
	"scope" varchar(1024),
	"id_token" varchar(1024),
	"session_state" varchar(1024),
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."session" (
	"sessionToken" varchar(1024) PRIMARY KEY NOT NULL,
	"userId" bigint NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."user" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp with time zone,
	"image" varchar(1024),
	"hoster" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."verificationToken" (
	"identifier" varchar(1024) NOT NULL,
	"token" varchar(1024) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."discord_guild_chat_commands" (
	"guild_id" bigint NOT NULL,
	"command_id" bigserial PRIMARY KEY NOT NULL,
	"reaction_text" text DEFAULT '' NOT NULL,
	"enable_auto_matching" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."discord_guild_chat_commands_trigger" (
	"command_id" bigint NOT NULL,
	"trigger" varchar(512) NOT NULL,
	"match_percentage" real DEFAULT 0.75 NOT NULL,
	"type" "command_trigger_match_type" DEFAULT 'prefix' NOT NULL,
	CONSTRAINT "discord_guild_chat_commands_trigger_command_id_trigger_pk" PRIMARY KEY("command_id","trigger")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."downloads" (
	"guild_id" bigint NOT NULL,
	"id" bigserial PRIMARY KEY NOT NULL,
	"version" varchar(64) NOT NULL,
	"mod_reference" varchar(128) NOT NULL,
	"patreon" boolean DEFAULT false NOT NULL,
	"uploaded_by" bigint NOT NULL,
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
CREATE TABLE IF NOT EXISTS "kbot2"."discord_guild" (
	"guild_id" bigint PRIMARY KEY NOT NULL,
	"total_members" integer DEFAULT 0 NOT NULL,
	"guild_created" timestamp with time zone DEFAULT now() NOT NULL,
	"image" varchar(1024) DEFAULT '' NOT NULL,
	"name" varchar(512) DEFAULT '' NOT NULL,
	"owner_id" bigint DEFAULT '0' NOT NULL,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."discord_guild_admins" (
	"guild_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	CONSTRAINT "discord_guild_admins_guild_id_user_id_pk" PRIMARY KEY("guild_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."discord_guild_configuration" (
	"guild_id" bigint NOT NULL,
	"changelog_suggestion_channel_id" bigint DEFAULT '0' NOT NULL,
	"changelog_bug_channel_id" bigint DEFAULT '0' NOT NULL,
	"changelog_announce_hidden_mods" boolean DEFAULT false NOT NULL,
	"changelog_forum_id" bigint DEFAULT '0' NOT NULL,
	"update_text_channel_id" bigint DEFAULT '0' NOT NULL,
	"default_ping_role" bigint DEFAULT '0' NOT NULL,
	"chat_command_prefix" char(1) DEFAULT '.' NOT NULL,
	"patreon_ping_roles" json DEFAULT '[]'::json NOT NULL,
	"patreon_release_text" varchar(8196) DEFAULT '0' NOT NULL,
	"patreon_announcement_channel_id" bigint DEFAULT '0' NOT NULL,
	"patreon_changelog_forum" bigint DEFAULT '0' NOT NULL,
	"public_ping_roles" json DEFAULT '[]'::json NOT NULL,
	"public_announcement_channel_id" bigint DEFAULT '0' NOT NULL,
	"public_changelog_forum" bigint DEFAULT '0' NOT NULL,
	"public_release_text" varchar(8196) DEFAULT '0' NOT NULL,
	CONSTRAINT "discord_guild_configuration_guild_id_pk" PRIMARY KEY("guild_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."discord_guild_configuration_blacklisted_mods" (
	"guild_id" bigint NOT NULL,
	"mod_reference" varchar(128) NOT NULL,
	CONSTRAINT "discord_guild_configuration_blacklisted_mods_guild_id_mod_reference_pk" PRIMARY KEY("guild_id","mod_reference")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."discord_guild_configuration_ficsit_user_ids" (
	"guild_id" bigint NOT NULL,
	"ficsit_user_id" bigint NOT NULL,
	CONSTRAINT "discord_guild_configuration_ficsit_user_ids_guild_id_ficsit_user_id_pk" PRIMARY KEY("guild_id","ficsit_user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."discord_guild_configuration_mod_roles" (
	"guild_id" bigint NOT NULL,
	"mod_reference" bigint NOT NULL,
	"role_id" bigint NOT NULL,
	CONSTRAINT "discord_guild_configuration_mod_roles_guild_id_mod_reference_pk" PRIMARY KEY("guild_id","mod_reference"),
	CONSTRAINT "discord_guild_configuration_mod_roles_mod_reference_role_id_unique" UNIQUE("mod_reference","role_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."discord_guild_patreons" (
	"guild_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	CONSTRAINT "discord_guild_patreons_guild_id_user_id_pk" PRIMARY KEY("guild_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."mod_updates" (
	"guild_id" bigint NOT NULL,
	"mod_reference" varchar(128) NOT NULL,
	"version" varchar(64) NOT NULL,
	"announced" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"announced_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mod_updates_guild_id_mod_reference_pk" PRIMARY KEY("guild_id","mod_reference")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."discord_guild_reaction_roles_message" (
	"message_id" bigint PRIMARY KEY NOT NULL,
	"guild_id" bigint NOT NULL,
	"channel_id" bigint NOT NULL,
	"name" varchar(128) DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."discord_guild_reaction_roles_message_emojies" (
	"message_id" bigint,
	"emoji" varchar(64) NOT NULL,
	"role_ids" json DEFAULT '[]'::json NOT NULL,
	CONSTRAINT "pk_message_emojies" PRIMARY KEY("message_id","emoji")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."discord_guild_releases" (
	"guild_id" bigint NOT NULL,
	"file" bigserial PRIMARY KEY NOT NULL,
	"patreon" boolean DEFAULT false NOT NULL,
	"expires" date,
	"mod_reference" varchar(128) NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "discord_guild_chat_commands_trigger_command_id_index" ON "kbot2"."discord_guild_chat_commands_trigger" ("command_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "downloads_mod_reference_index" ON "kbot2"."downloads" ("mod_reference");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mod_cache_mod_reference_index" ON "ficsit_app"."mod_cache" ("mod_reference");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "discord_guild_configuration_blacklisted_mods_mod_reference_index" ON "kbot2"."discord_guild_configuration_blacklisted_mods" ("mod_reference");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "discord_guild_configuration_ficsit_user_ids_ficsit_user_id_index" ON "kbot2"."discord_guild_configuration_ficsit_user_ids" ("ficsit_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "discord_guild_configuration_mod_roles_mod_reference_index" ON "kbot2"."discord_guild_configuration_mod_roles" ("mod_reference");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "discord_guild_configuration_mod_roles_role_id_index" ON "kbot2"."discord_guild_configuration_mod_roles" ("role_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "discord_guild_patreons_user_id_index" ON "kbot2"."discord_guild_patreons" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mod_updates_mod_reference_index" ON "kbot2"."mod_updates" ("mod_reference");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "discord_guild_releases_guild_id_index" ON "kbot2"."discord_guild_releases" ("guild_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "discord_guild_releases_mod_reference_index" ON "kbot2"."discord_guild_releases" ("mod_reference");--> statement-breakpoint
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
 ALTER TABLE "kbot2"."downloads" ADD CONSTRAINT "downloads_guild_id_discord_guild_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "kbot2"."discord_guild"("guild_id") ON DELETE cascade ON UPDATE no action;
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kbot2"."discord_guild_patreons" ADD CONSTRAINT "discord_guild_patreons_guild_id_discord_guild_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "kbot2"."discord_guild"("guild_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kbot2"."mod_updates" ADD CONSTRAINT "mod_updates_guild_id_discord_guild_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "kbot2"."discord_guild"("guild_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kbot2"."discord_guild_reaction_roles_message" ADD CONSTRAINT "discord_guild_reaction_roles_message_guild_id_discord_guild_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "kbot2"."discord_guild"("guild_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kbot2"."discord_guild_reaction_roles_message_emojies" ADD CONSTRAINT "discord_guild_reaction_roles_message_emojies_message_id_discord_guild_reaction_roles_message_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "kbot2"."discord_guild_reaction_roles_message"("message_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kbot2"."discord_guild_releases" ADD CONSTRAINT "discord_guild_releases_guild_id_discord_guild_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "kbot2"."discord_guild"("guild_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
