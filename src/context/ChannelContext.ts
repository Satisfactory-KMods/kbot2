import { DiscordForumChannel, DiscordTextChannel, DiscordVoiceChannel } from '@shared/types/discord';
import { createContext } from 'react';

const ForumChannelContext = createContext<DiscordForumChannel[]>([]);
const VoiceChannelContext = createContext<DiscordVoiceChannel[]>([]);
const TextChannelContext = createContext<DiscordTextChannel[]>([]);

export { ForumChannelContext, TextChannelContext, VoiceChannelContext };
