import { useContext }  from "react";
import {
	ForumChannelContext,
	TextChannelContext,
	VoiceChannelContext
}                      from "@context/ChannelContext";
import { ModContext }  from "@context/ModContext";
import { RoleContext } from "@context/RoleContext";
import GuildContext    from "@context/GuildContext";

export default function useGuild() {
	const textChannels = useContext( TextChannelContext );
	const mods = useContext( ModContext );
	const roles = useContext( RoleContext );
	const forumChannels = useContext( ForumChannelContext );
	const voiceChannels = useContext( VoiceChannelContext );
	const { guildData, triggerGuildUpdate } = useContext( GuildContext );

	return {
		guildData,
		triggerGuildUpdate,
		voiceChannels,
		textChannels,
		mods,
		roles,
		forumChannels
	};
}