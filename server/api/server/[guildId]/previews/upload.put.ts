import { readFiles } from 'h3-formidable';
import { join } from 'path';
import { env } from '~/env';
import { createEmbed } from '~/server/bot/utils/embed';
import { getRouteBaseParams } from '~/server/bot/utils/routes';
import { db, scDownloadFiles, scDownloads, scModCache } from '~/server/utils/db/postgres/pg';
import { log } from '~/utils/logger';

export default defineEventHandler(async (event) => {
	const { user, guildId, guildData } = await getRouteBaseParams(event);

	const { fields, files } = await readFiles(event, {
		maxFileSize: 5e9
	});

	if (!Array.isArray(files.files) || files.files.length === 0) {
		throw createError('No files uploaded');
	}

	const { mod_reference, version, changelog, patreon = true } = fields as Record<string, any>;

	const mod = await db.select().from(scModCache).firstOrThrow('Failed to get mod from ref');

	let dirty = false;
	let base = join(process.cwd(), 'uploads', guildId);
	const result = await db
		.transaction(async (trx) => {
			const { id } = await trx
				.insert(scDownloads)
				.values({
					guild_id: guildId,
					changelog,
					mod_reference,
					version,
					patreon,
					uploaded_by: user.discordId
				})
				.returning({
					id: scDownloads.id
				})
				.firstOrThrow('Failed to insert download');

			for (const file of files.files ?? []) {
				const name = file.originalFilename;
				const mime = file.mimetype;
				const size = file.size;

				if (!name || !mime || !size) {
					throw createError('Invalid file');
				}
				base = join(base, id);

				const f = await trx
					.insert(scDownloadFiles)
					.values({
						download_id: id,
						name,
						mime,
						size
					})
					.returning()
					.firstOrThrow('Failed to insert file');
				await FileAdapter.move(file.filepath, join(base, f.id));
				dirty = true;
			}

			return id;
		})
		.catch(async (e) => {
			if (dirty) {
				await FileAdapter.remove(base).catch((e) => {
					return log('error', e);
				});
			}

			for (const file of files.files ?? []) {
				await FileAdapter.remove(file.filepath).catch((e) => {
					return log('error', e);
				});
			}

			throw e;
		});

	for (const file of files.files ?? []) {
		await FileAdapter.remove(file.filepath).catch((e) => {
			return log('error', e);
		});
	}

	const name = `${mod.name} - v.${version}`.substring(0, 99);
	const config = guildData.config;

	const pingString = `${(patreon ? config.base.patreon_ping_roles : config.base.public_ping_roles)
		.map((id) => {
			return `<@&${id}>`;
		})
		.join(', ')}\n`;

	const embed = createEmbed({
		author: {
			name: mod.name,
			iconURL: mod.logo
		},
		thumbnail: mod.logo,
		title: 'Download now!',
		url: `${env.auth.url}/download/${guildId}/files/${result}`
	});

	if (patreon) {
		const changelogThread = await guildData.sendForumThread({
			channelId: config.base.patreon_changelog_forum,
			thread: {
				name,
				message: {
					content: changelog
				}
			}
		});

		await guildData.sendMessageInChannel({
			channelId: config.base.patreon_announcement_channel_id,
			message: {
				content: (pingString + config.base.patreon_release_text).replaceAll(
					'{changelog}',
					changelogThread ? `<#${changelogThread.id}>` : 'No Changelog Thread'
				),
				embeds: embed ? [embed] : undefined
			}
		});
	} else {
		const changelogThread = await guildData.sendForumThread({
			channelId: config.base.public_changelog_forum,
			thread: {
				name,
				message: {
					content: changelog
				}
			}
		});

		await guildData.sendMessageInChannel({
			channelId: config.base.public_announcement_channel_id,
			message: {
				content: (pingString + config.base.public_release_text).replaceAll(
					'{changelog}',
					changelogThread ? `<#${changelogThread.id}>` : 'No Changelog Thread'
				),
				embeds: embed ? [embed] : undefined
			}
		});
	}

	return {
		success: true
	};
});
