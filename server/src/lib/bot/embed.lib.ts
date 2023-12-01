import { EmbedBuilder } from 'discord.js';
import z, { ZodError } from 'zod';

const EmbedOptionsSchema = z.object({
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

export type EmbedOptions = z.infer<typeof EmbedOptionsSchema>;

export function createEmbed(o: EmbedOptions): EmbedBuilder | undefined {
	try {
		o = EmbedOptionsSchema.parse(o);
		const embed = new EmbedBuilder();

		embed.setThumbnail(o.thumbnail || 'https://kbot2.kyrium.space/images/logo.png');
		o.url && embed.setURL(o.url);
		embed.setColor('#0099ff');
		embed.setTitle(o.title);
		embed.setAuthor({
			name: o.author?.name || DiscordBot.user.username,
			iconURL: o.author?.iconURL || 'https://kbot2.kyrium.space/images/logo.png'
		});
		o.fields?.length && embed.setFields(o.fields);
		!o.disableTimestamp && embed.setTimestamp();
		embed.setFooter({
			text: 'KMods Team'
		});

		return embed;
	} catch (e) {
		if (e instanceof ZodError) {
			SystemLib.DebugLog('zod', e.message);
		}
	}
}
