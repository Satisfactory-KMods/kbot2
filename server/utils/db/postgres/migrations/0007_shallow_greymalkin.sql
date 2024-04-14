ALTER TABLE "kbot2"."discord_guild_configuration_blacklisted_mods" ALTER COLUMN "mod_reference" SET DATA TYPE varchar(128);--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild_releases" ALTER COLUMN "mod_reference" SET DATA TYPE varchar(128);--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild_reaction_roles_message" ADD COLUMN "name" varchar(128) DEFAULT '' NOT NULL;