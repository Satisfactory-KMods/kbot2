import { Events } from 'discord.js';
import { log } from '~/utils/logger';
import { botClient } from '../bot';
import { handleReactionRole } from './actions/reaction/reactionRole';

botClient.on(Events.MessageReactionAdd, async (reaction, user) => {
	if (user.bot) return;

	await handleReactionRole(reaction, user);
});

log('bot', 'MessageReactionAdd event loaded');
