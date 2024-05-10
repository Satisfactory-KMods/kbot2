/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { EmbedBuilder } from 'discord.js';
import { z } from 'zod';
import { LOGO } from '~/utils/constant';
import { log } from '~/utils/logger';
import { botClient } from '../bot';

const embedOptionsSchema = z.object({
	title: z.string(),
	disableTimestamp: z.boolean().optional(),
	url: z.string().optional(),
	thumbnail: z.string().optional(),
	fields: z
		.array(
			z.object({
				name: z.string().max(256),
				value: z.string().max(1024),
				inline: z.boolean().optional()
			})
		)
		.min(1)
		.max(10)
		.optional(),
	author: z
		.object({
			name: z.string(),
			iconURL: z.string()
		})
		.optional()
});

export type EmbedOptions = z.input<typeof embedOptionsSchema>;

function validateIsUrl(url: string, fallback: string) {
	try {
		// eslint-disable-next-line no-new
		new URL(url);
		return url;
	} catch (e) {
		return fallback;
	}
}

export function createEmbed(o: EmbedOptions): EmbedBuilder | undefined {
	try {
		o = embedOptionsSchema.parse(o);
		const embed = new EmbedBuilder();

		const thumbnail = validateIsUrl(o.thumbnail || LOGO, LOGO);
		const iconURL = validateIsUrl(o.author?.iconURL || LOGO, LOGO);

		embed.setThumbnail(thumbnail);
		o.url && embed.setURL(o.url);
		embed.setColor('#0099ff');
		embed.setTitle(o.title);
		embed.setAuthor({
			name: o.author?.name ?? botClient.user?.username ?? 'KMods Team',
			iconURL
		});
		o.fields?.length && embed.setFields(o.fields);
		!o.disableTimestamp && embed.setTimestamp();
		embed.setFooter({
			text: 'KMods Team'
		});

		return embed;
	} catch (e) {
		log('bot-error', e);
	}
}
