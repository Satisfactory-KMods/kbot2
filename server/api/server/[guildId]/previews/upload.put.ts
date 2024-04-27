import { readFiles } from 'h3-formidable';
import { join } from 'path';
import { getRouteBaseParams } from '~/server/bot/utils/routes';
import { db, scDownloadFiles, scDownloads } from '~/server/utils/db/postgres/pg';
import { log } from '~/utils/logger';

export default defineEventHandler(async (event) => {
	const { user, guildId } = await getRouteBaseParams(event);

	const { fields, files } = await readFiles(event, {
		maxFileSize: 5e9
	});

	if (!Array.isArray(files.files) || files.files.length === 0) {
		throw createError('No files uploaded');
	}

	const { mod_reference, version, changelog, patreon = true } = fields as Record<string, any>;

	let dirty = false;
	let base = join(process.cwd(), 'uploads', guildId);
	await db
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

	return {
		success: true
	};
});
