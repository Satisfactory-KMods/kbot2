import {
	DiscordForumChannel,
	DiscordRole,
	DiscordTextChannel
}                 from "@shared/types/discord";
import {
	MultiValue,
	SingleValue
}                 from "react-select";
import { MO_Mod } from "@shared/types/MongoDB";

export interface Selection<T = string> {
	value : T;
	label : string;
	disabled? : boolean;
	hidden? : boolean;
}

export function channelToSelection<T extends DiscordTextChannel | DiscordForumChannel>( channels : T[] ) : Selection<string>[] {
	return channels.map( ( channel ) => ( { label: `${ channel.id } > ${ channel.name }`, value: channel.id } ) );
}

export function rolesToSelection( roles : DiscordRole[] ) : Selection<string>[] {
	return roles.map( ( role ) => ( { label: `${ role.id } > ${ role.name }`, value: role.id } ) );
}


export function modsToSelection( mods : MO_Mod[] ) : Selection<string>[] {
	return mods.map( ( e ) => ( { label: e.name, value: e.mod_reference } ) );
}

export function channelToSelected<T extends DiscordTextChannel | DiscordForumChannel>( channels : T[], selectedIds : string[] ) : MultiValue<Selection<string>> {
	return channelToSelection( channels ).filter( e => selectedIds.includes( e.value ) );
}

export function channelToSelectedSingle<T extends DiscordTextChannel | DiscordForumChannel>( channels : T[], selectedId : string ) : SingleValue<Selection<string>> {
	return channelToSelection( channels ).find( e => e.value === selectedId ) || null;
}

export function roleToSelectedSingle( roles : DiscordRole[], selectedId : string ) : SingleValue<Selection<string>> {
	return rolesToSelection( roles ).find( e => e.value === selectedId ) || null;
}

export function roleToSelectedMulti( roles : DiscordRole[], selectedIds : string[] ) : MultiValue<Selection<string>> {
	return rolesToSelection( roles ).filter( e => selectedIds.includes( e.value ) ) || [];
}

export function modsToSelectionMulti( mods : MO_Mod[], ids : string[] ) : MultiValue<Selection<string>> {
	return modsToSelection( mods ).filter( e => ids.includes( e.value ) );
}