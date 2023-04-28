import { createContext } from "react";
import {
	DiscordForumChannel,
	DiscordTextChannel,
	DiscordVoiceChannel
}                        from "@shared/types/discord";

const ForumChannelContext = createContext<DiscordForumChannel[]>( [] );
const VoiceChannelContext = createContext<DiscordVoiceChannel[]>( [] );
const TextChannelContext = createContext<DiscordTextChannel[]>( [] );

export {
	ForumChannelContext,
	VoiceChannelContext,
	TextChannelContext
};