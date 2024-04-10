import { Events } from 'discord.js';
import { handleReactionRole } from './actions/reaction/reactionRole';

botClient.on(Events.MessageReactionAdd, async (reaction, user) => {
	if (user.bot) return;

	await handleReactionRole(reaction, user);
});
