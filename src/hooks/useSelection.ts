import { useMemo } from "react";
import useGuild    from "@hooks/useGuild";
import {
	channelToSelection,
	modsToSelection,
	rolesToSelection
}                  from "@lib/selectConversion";

export default function useSelection() {
	const { roles, forumChannels, textChannels, voiceChannels, mods, guildData } = useGuild();

	const roleOptions = useMemo( () => rolesToSelection( roles ), [ roles ] );
	const voiceChannelOptions = useMemo( () => channelToSelection( voiceChannels ), [ voiceChannels ] );
	const textChannelOptions = useMemo( () => channelToSelection( textChannels ), [ textChannels ] );
	const forumChannelOptions = useMemo( () => channelToSelection( forumChannels ), [ forumChannels ] );
	const bothChannelOptions = useMemo( () => channelToSelection( forumChannels ).concat( channelToSelection( textChannels ) ), [ forumChannels, textChannels ] );
	const modOptions = useMemo( () => modsToSelection( mods.filter( e => guildData.options.ficsitUserIds.includes( e.creator_id ) ) ), [ mods, guildData.options.ficsitUserIds ] );

	return {
		roleOptions, bothChannelOptions, forumChannelOptions, textChannelOptions, modOptions, voiceChannelOptions
	};
}