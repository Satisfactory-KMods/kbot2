import { and, eq, inArray, isNotNull } from '@kmods/drizzle-pg';
import {
	getColumnsFromViewOrSubquery,
	now,
	pgAggJsonBuildObject,
	pgAnyValue
} from '@kmods/drizzle-pg/pg-core';
import moment from 'moment';
import { log } from '~/utils/logger';
import { createEmbed } from '../bot/utils/embed';
import { DiscordGuildManager } from '../bot/utils/guildManager';
import {
	db,
	scGuild,
	scGuildConfiguration,
	scGuildConfigurationFicsitUserIds,
	scModAuthors,
	scModUpdates
} from '../utils/db/postgres/pg';
import { viewMods } from '../utils/db/postgres/views';

export async function checkForModUpdates() {
	log('tasks', 'Check for mod updates started!');
	const guilds = await db
		.select({
			guild_id: scGuild.guild_id,
			changelog_announce_hidden_mods: pgAnyValue(
				scGuildConfiguration.changelog_announce_hidden_mods
			),
			update_text_channel_id: pgAnyValue(scGuildConfiguration.update_text_channel_id),
			changelog_forum_id: pgAnyValue(scGuildConfiguration.changelog_forum_id),
			default_ping_role: pgAnyValue(scGuildConfiguration.default_ping_role),
			changelog_bug_channel_id: pgAnyValue(scGuildConfiguration.changelog_bug_channel_id),
			changelog_suggestion_channel_id: pgAnyValue(
				scGuildConfiguration.changelog_suggestion_channel_id
			),
			configuration: pgAggJsonBuildObject(scGuildConfiguration, {
				aggregate: true,
				index: 0
			}),
			ficsit_users: pgAggJsonBuildObject(scGuildConfigurationFicsitUserIds, {
				aggregate: true
			}),
			mod_updates: pgAggJsonBuildObject(scModUpdates, { aggregate: true })
		})
		.from(scGuild)
		.innerJoin(scGuildConfiguration, ['guild_id'])
		.innerJoin(scGuildConfigurationFicsitUserIds, ['guild_id'])
		.leftJoin(scModUpdates, ['guild_id'])
		.groupBy(scGuild.guild_id);

	for (const { guild_id, ficsit_users, mod_updates, ...configuration } of guilds) {
		if (!ficsit_users.length) continue;

		const dirtyMods = await db
			.selectDistinctOn([viewMods.mod_reference], getColumnsFromViewOrSubquery(viewMods))
			.from(viewMods)
			.innerJoin(scModAuthors, eq(viewMods.mod_id, scModAuthors.mod_id))
			.where(
				and(
					isNotNull(viewMods.last_version),
					inArray(
						scModAuthors.user_id,
						ficsit_users.map((u) => {
							return u.ficsit_user_id;
						})
					),
					!configuration.changelog_announce_hidden_mods
						? eq(viewMods.hidden, false)
						: undefined
				)
			)
			.then((mods) => {
				return mods.filter((mod) => {
					const exists = mod_updates.find((update) => {
						return update.mod_reference === mod.mod_reference;
					});
					if (!exists) {
						return true;
					}

					if (moment(exists.updated_at).isBefore(mod.updated_at)) {
						return true;
					}

					return false;
				});
			});

		for (const mod of dirtyMods) {
			let announce = false;
			const exists = mod_updates.find((update) => {
				return update.mod_reference === mod.mod_reference;
			});
			if (exists && moment(exists.updated_at).isBefore(mod.updated_at)) {
				announce = true;
			}

			await db
				.transaction(async (trx) => {
					await trx
						.insert(scModUpdates)
						.values({
							guild_id,
							mod_reference: mod.mod_reference,
							version: mod.last_version!.version
						})
						.onConflictDoUpdate({
							target: [scModUpdates.guild_id, scModUpdates.mod_reference],
							set: {
								announced_at: now(),
								updated_at: now()
							}
						})
						.returning()
						.firstOrThrow('Failed to insert mod update');

					const guild = await DiscordGuildManager.getGuild(guild_id);
					if (announce && guild.isValid()) {
						const updateChannel = await guild.chatChannel(
							configuration.update_text_channel_id
						);
						const changelogThreadChannel = await guild.forumChannel(
							configuration.changelog_forum_id
						);

						if (!updateChannel) {
							throw new Error(
								`Update channel ${configuration.update_text_channel_id} not found for guild ${guild_id}`
							);
						}

						let threadId: null | string = null;
						if (changelogThreadChannel) {
							const tag = changelogThreadChannel.availableTags.find((e) => {
								return e.name === mod.mod_reference;
							});
							const appliedTags = tag ? [tag.id] : [];

							await guild
								.sendForumThread({
									channelId: configuration.changelog_forum_id,
									thread: {
										name: `${mod.name} - v.${mod.last_version!.version}`,
										message: {
											content: mod.last_version!.changelog
										},
										appliedTags
									}
								})
								.then((thread) => {
									if (!thread) return;
									threadId = thread.id;
								});
						}

						if (updateChannel) {
							const embed = createEmbed({
								author: {
									name: mod.name,
									iconURL: mod.logo
								},
								thumbnail: mod.logo,
								title: `v.${mod.versions[0].version} - ${mod.name}`,
								fields: [
									{
										name:
											mod.versions[0].changelog !== ''
												? mod.versions[0].changelog
														.split(/\r?\n/)[0]
														.substring(0, 255)
												: '...',
										value: `Now available on SMM and SMR \n\n For any suggestion please use <#${configuration.changelog_suggestion_channel_id}> \n And for bug reports <#${configuration.changelog_bug_channel_id}>.`
									},
									{
										name: 'Changelog',
										value: threadId
											? `<#${threadId}>`
											: `[Click here](https://ficsit.app/mod/${mod.mod_reference}/version/${mod.versions[0].id})`,
										inline: true
									},
									{
										name: 'Mod Page',
										value: `[Click here](https://ficsit.app/mod/${mod.mod_reference})`,
										inline: true
									},
									{
										name: 'All our Mods',
										value: `[Click here](https://ficsit.app/user/${mod.creator_id})`,
										inline: true
									}
								]
							});

							const role =
								guild.getGuild.roles.cache.find((role) => {
									return role.id === configuration.default_ping_role;
								}) ?? guild.getGuild.roles.everyone;

							await updateChannel.send({
								embeds: embed ? [embed] : undefined,
								content: `${role} new mod update has been released!\n\n`
							});
						}
					}
				})
				.catch((e) => {
					log('tasks-error', e);
				});
		}
	}
	log('tasks', 'Check for mod updates Finished!');
}