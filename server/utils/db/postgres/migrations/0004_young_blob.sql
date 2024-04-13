ALTER TABLE "kbot2"."discord_guild_releases" RENAME COLUMN "mod_ref" TO "mod_reference";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mod_cache_mod_reference_index" ON "ficsit_app"."mod_cache" ("mod_reference");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "discord_guild_configuration_blacklisted_mods_mod_reference_index" ON "kbot2"."discord_guild_configuration_blacklisted_mods" ("mod_reference");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "discord_guild_configuration_ficsit_user_ids_ficsit_user_id_index" ON "kbot2"."discord_guild_configuration_ficsit_user_ids" ("ficsit_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "discord_guild_configuration_mod_roles_mod_reference_index" ON "kbot2"."discord_guild_configuration_mod_roles" ("mod_reference");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "discord_guild_configuration_mod_roles_role_id_index" ON "kbot2"."discord_guild_configuration_mod_roles" ("role_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "discord_guild_patreons_user_id_index" ON "kbot2"."discord_guild_patreons" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mod_updates_mod_reference_index" ON "kbot2"."mod_updates" ("mod_reference");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "discord_guild_releases_guild_id_index" ON "kbot2"."discord_guild_releases" ("guild_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "discord_guild_releases_mod_reference_index" ON "kbot2"."discord_guild_releases" ("mod_reference");--> statement-breakpoint
ALTER TABLE "kbot2"."discord_guild_configuration_mod_roles" ADD CONSTRAINT "discord_guild_configuration_mod_roles_mod_reference_role_id_unique" UNIQUE("mod_reference","role_id");