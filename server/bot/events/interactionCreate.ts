import { Events } from 'discord.js';
import { log } from '~/utils/logger';
import { botClient } from '../bot';

botClient.on(Events.InteractionCreate, async () => {});

log('bot', 'InteractionCreate event loaded');

export {};
