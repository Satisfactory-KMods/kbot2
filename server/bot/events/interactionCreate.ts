import { Events } from 'discord.js';
import { botClient } from '../bot';

botClient.on(Events.InteractionCreate, async () => {});

log('bot', 'InteractionCreate event loaded');

export {};
