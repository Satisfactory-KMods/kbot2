import { ForumChannelContext, TextChannelContext, VoiceChannelContext } from '@context/ChannelContext';
import GuildContext from '@context/GuildContext';
import { ModContext } from '@context/ModContext';
import { RoleContext } from '@context/RoleContext';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';

export default function useGuild() {
	const { guildId } = useParams();
	const textChannels = useContext(TextChannelContext);
	const mods = useContext(ModContext);
	const roles = useContext(RoleContext);
	const forumChannels = useContext(ForumChannelContext);
	const voiceChannels = useContext(VoiceChannelContext);
	const { guildData, triggerGuildUpdate } = useContext(GuildContext);

	return {
		guildId: guildId!,
		guildData,
		triggerGuildUpdate,
		voiceChannels,
		textChannels,
		mods,
		roles,
		forumChannels
	};
}
