DO $$ BEGIN
 CREATE TYPE "command_trigger_match_type" AS ENUM('prefix', 'fuzzy', 'regex');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."discord_guild_reaction_roles_message" (
	"message_id" numeric PRIMARY KEY NOT NULL,
	"guild_id" numeric NOT NULL,
	"channel_id" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kbot2"."discord_guild_reaction_roles_message_emojies" (
	"message_id" numeric,
	"emoji" varchar(64) NOT NULL,
	"role_ids" json DEFAULT '[]'::json NOT NULL,
	CONSTRAINT "pk_message_emojies" PRIMARY KEY("message_id","emoji")
);
--> statement-breakpoint
DROP TABLE "kbot2"."discord_guild_reaction_roles";--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild_chat_commands" ALTER COLUMN "reaction_text" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild_chat_commands" ALTER COLUMN "reaction_text" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild_chat_commands" ALTER COLUMN "reaction_text" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild_chat_commands_trigger" ALTER COLUMN "trigger" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild_chat_commands_trigger" ALTER COLUMN "trigger" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild_chat_commands" ADD COLUMN "enable_auto_matching" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild_chat_commands_trigger" ADD COLUMN "match_percentage" real DEFAULT 0.75 NOT NULL;--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild_chat_commands_trigger" ADD COLUMN "type" "command_trigger_match_type" DEFAULT 'prefix' NOT NULL;--> statement-breakpoint
ALTER TABLE "kbot2"."mod_updates" ADD COLUMN "announced_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild_chat_commands" DROP COLUMN IF EXISTS "auto_reaction_matches";--> statement-breakpoint
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
