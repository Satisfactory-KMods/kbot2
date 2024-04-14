import { getColumns, pgAggJsonBuildObject, pgCoalesce, pgJsonAgg } from '@kmods/drizzle-pg/pg-core';
import {
	kbot2Schema,
	scGuildConfiguration,
	scGuildConfigurationBlacklistedMods,
	scGuildConfigurationFicsitUserIds,
	scGuildConfigurationModRoles
} from '../schema';

export const viewGuildConfig = kbot2Schema.view('guild_config').as((db) => {
	const withModRoles = db.$with('mod_roles').as(
		db
			.select({
				guild_id: scGuildConfigurationModRoles.guild_id,
				mod_roles: pgAggJsonBuildObject(
					{
						role_id: scGuildConfigurationModRoles.role_id,
						mod_reference: scGuildConfigurationModRoles.mod_reference
					},
					{ aggregate: true }
				).as('mod_roles')
			})
			.from(scGuildConfigurationModRoles)
			.groupBy(scGuildConfigurationModRoles.guild_id)
	);

	const withBlacklistedMods = db.$with('blacklisted_mods').as(
		db
			.select({
				guild_id: scGuildConfigurationBlacklistedMods.guild_id,
				blacklisted_mods: pgJsonAgg(scGuildConfigurationBlacklistedMods.mod_reference).as(
					'blacklisted_mods'
				)
			})
			.from(scGuildConfigurationBlacklistedMods)
			.groupBy(scGuildConfigurationBlacklistedMods.guild_id)
	);

	const withFicsitUserIds = db.$with('ficsit_user_ids').as(
		db
			.select({
				guild_id: scGuildConfigurationFicsitUserIds.guild_id,
				ficsit_user_ids: pgJsonAgg(scGuildConfigurationFicsitUserIds.ficsit_user_id).as(
					'ficsit_user_ids'
				)
			})
			.from(scGuildConfigurationFicsitUserIds)
			.groupBy(scGuildConfigurationFicsitUserIds.guild_id)
	);

	return db
		.with(withModRoles, withBlacklistedMods, withFicsitUserIds)
		.select({
			...getColumns(scGuildConfiguration),
			mod_roles: pgCoalesce(withModRoles.mod_roles).as('mod_roles'),
			ficsit_user_ids: pgCoalesce(withFicsitUserIds.ficsit_user_ids).as('ficsit_user_ids'),
			blacklisted_mods: pgCoalesce(withBlacklistedMods.blacklisted_mods).as(
				'blacklisted_mods'
			)
		})
		.from(scGuildConfiguration)
		.leftJoin(withFicsitUserIds, ['guild_id'])
		.leftJoin(withModRoles, ['guild_id'])
		.leftJoin(withBlacklistedMods, ['guild_id']);
});
