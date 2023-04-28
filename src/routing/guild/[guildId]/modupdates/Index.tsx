import {
	FC,
	useContext,
	useId,
	useMemo,
	useState
}                             from "react";
import {
	json,
	LoaderFunction,
	useLoaderData,
	useParams
}                             from "react-router-dom";
import {
	tRCP_handleError,
	tRPC_Guild
}                             from "@lib/tRPC";
import GuildContext           from "@context/GuildContext";
import { EChannelType }       from "@shared/Enum/EDiscord";
import {
	DiscordForumChannel,
	DiscordRole,
	DiscordTextChannel
}                             from "@shared/types/discord";
import {
	MO_Mod,
	MO_ModUpdate,
	MO_RolePingRule
}                             from "@shared/types/MongoDB";
import {
	channelToSelectedSingle,
	channelToSelection,
	modsToSelection,
	modsToSelectionMulti,
	rolesToSelection,
	roleToSelectedSingle,
	Selection
}                             from "@lib/selectConversion";
import {
	Button,
	Label,
	Tabs,
	ToggleSwitch
}                             from "flowbite-react";
import {
	BiCog,
	BiMessage,
	BiSave,
	BiTrash
}                             from "react-icons/all";
import LoadButton             from "@comp/LoadButton";
import Select, { MultiValue } from "react-select";
import CreatableSelect        from "react-select/creatable";
import _                      from "lodash";
import ModWatchRow            from "@comp/modsUpdate/ModWatchRow";
import { fireToastFromApi }   from "@lib/sweetAlert";

interface LoaderData {
	textChannels : DiscordTextChannel[];
	forumChannels : DiscordForumChannel[];
	watchedMods : MO_ModUpdate[];
	mods : MO_Mod[];
	roles : DiscordRole[];
}

const loader : LoaderFunction = async( { params } ) => {
	const { guildId } = params;

	const [ textChannelsResult, forumChannelsResult, watchedModsResult, modsResult, rolesResult ] = await Promise.all( [
		tRPC_Guild.channels.oftype.query( {
			guildId: guildId!,
			type: EChannelType.text
		} ),
		tRPC_Guild.channels.oftype.query( {
			guildId: guildId!,
			type: EChannelType.forum
		} ),
		tRPC_Guild.modupdates.watchedmods.query( {
			guildId: guildId!
		} ),
		tRPC_Guild.modupdates.mods.query( {
			guildId: guildId!
		} ),
		tRPC_Guild.roles.getrole.query( {
			guildId: guildId!
		} )
	] );

	const textChannels : any[] = textChannelsResult?.channels || [];
	const forumChannels : any[] = forumChannelsResult?.channels || [];
	const roles : any[] = rolesResult?.roles || [];
	const watchedMods : any[] = watchedModsResult?.mods || [];
	const mods : any[] = modsResult?.mods || [];

	return json<LoaderData>( {
		textChannels, forumChannels, watchedMods, mods, roles
	} );
};

const Component : FC = () => {
	const { guildId } = useParams();
	const Id = useId();
	const { guildData, triggerGuildUpdate } = useContext( GuildContext );
	const { textChannels, forumChannels, watchedMods, mods, roles } = useLoaderData() as LoaderData;
	const [ isLoading, setIsLoading ] = useState( false );

	const [ modsUpdateAnnouncement, setModsUpdateAnnouncement ] = useState( () => guildData.options.modsUpdateAnnouncement );
	const [ modsAnnounceHiddenMods, setModsAnnounceHiddenMods ] = useState( () => guildData.options.modsAnnounceHiddenMods );

	const [ selectedTextChannel, setSelectedTextChannel ] = useState( () => channelToSelectedSingle( textChannels, guildData.options.updateTextChannelId ) );
	const [ selectedBugChannel, setSelectedBugChannel ] = useState( () => channelToSelectedSingle( textChannels, guildData.options.updateTextChannelId ) || channelToSelectedSingle( forumChannels, guildData.options.updateTextChannelId ) );
	const [ selectedSuggestionChannel, setSelectedSuggestionChannel ] = useState( () => channelToSelectedSingle( textChannels, guildData.options.updateTextChannelId ) || channelToSelectedSingle( forumChannels, guildData.options.updateTextChannelId ) );
	const [ selectedForumChannel, setSelectedForumChannel ] = useState( () => channelToSelectedSingle( forumChannels, guildData.options.changelogForumId ) );
	const [ blacklistedMods, setblacklistedMods ] = useState( () => modsToSelectionMulti( mods, guildData.options.blacklistedMods ) );
	const [ RolePingRules, setRolePingRules ] = useState<MO_RolePingRule[]>( () => guildData.options.RolePingRules );
	const [ ficsitUserIds, setFicsitUserIds ] = useState<MultiValue<Selection>>( () => guildData.options.ficsitUserIds.map( id => ( {
		value: id,
		label: id
	} ) ) );

	const roleOptions = useMemo( () => rolesToSelection( roles ), [ roles ] );
	const textChannelOptions = useMemo( () => channelToSelection( textChannels ), [ textChannels ] );
	const forumChannelOptions = useMemo( () => channelToSelection( forumChannels ), [ forumChannels ] );
	const bothChannelOptions = useMemo( () => channelToSelection( forumChannels ).concat( channelToSelection( textChannels ) ), [ forumChannels, textChannels ] );
	const modOptions = useMemo( () => modsToSelection( mods ), [ mods ] );

	const onSubmit = async() => {
		setIsLoading( true );
		const response = await tRPC_Guild.modupdates.updateconfig.mutate( {
			guildId: guildId!,
			data: {
				modsAnnounceHiddenMods,
				modsUpdateAnnouncement,
				suggestionChannelId: selectedTextChannel?.value || "",
				bugChannelId: selectedTextChannel?.value || "",
				changelogForumId: selectedTextChannel?.value || "",
				updateTextChannelId: selectedTextChannel?.value || "",
				RolePingRules: RolePingRules.filter( e => e.roleId !== "" && e.modRefs.length > 0 ),
				blacklistedMods: blacklistedMods.map( e => e.value ),
				ficsitUserIds: ficsitUserIds.map( e => e.value )
			}
		} ).catch( tRCP_handleError );

		if ( response ) {
			setRolePingRules( curr => curr.filter( e => e.roleId !== "" && e.modRefs.length > 0 ) );
			fireToastFromApi( response.message, true );
			await triggerGuildUpdate();
		}
		setIsLoading( false );
	};

	return (
		<>
			<div
				className="flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col w-full p-0 mb-4">
				<div className="flex h-full flex-col justify-center gap-4 p-0">
					<div className="flex flex-col gap-2">
						<Tabs.Group style="underline">
							<Tabs.Item active={ true } title="Settings" icon={ BiCog }>
								<ToggleSwitch checked={ modsUpdateAnnouncement } id={ `${ Id }enabled` }
								              label="Enable system"
								              onChange={ setModsUpdateAnnouncement }/>
								<ToggleSwitch checked={ modsAnnounceHiddenMods } id={ `${ Id }enabled` }
								              className="mt-3 mb-3"
								              label="Announce updates for hidden mods"
								              onChange={ setModsAnnounceHiddenMods }/>


								<div className="mb-3 block">
									<Label value="Blacklisted Mods"/>
								</div>
								<Select options={ modOptions }
								        className="mt-2 mb-3 my-react-select-container w-full"
								        isClearable={ true }
								        classNamePrefix="my-react-select" isMulti={ true } value={ blacklistedMods }
								        onChange={ setblacklistedMods }/>


								<div className="mb-3 block">
									<Label value="Ficsit users"/>
								</div>
								<CreatableSelect options={ ficsitUserIds }
								                 placeholder="Type a user id here and press enter"
								                 className="mt-2 mb-3 my-react-select-container w-full"
								                 isClearable={ true }
								                 classNamePrefix="my-react-select" isMulti={ true }
								                 value={ ficsitUserIds }
								                 onCreateOption={ e => setFicsitUserIds( curr => curr.concat( {
									                 value: e,
									                 label: e
								                 } ) ) } onChange={ setFicsitUserIds }/>


								<div className="mb-3 block">
									<Label htmlFor={ `${ Id }rules` } value="Rule for ping roles for specific mods"/>
								</div>

								<Button color="green" type="button"
								        onClick={ () => setRolePingRules( curr => curr.concat( {
									        roleId: "",
									        modRefs: []
								        } ) ) }
								        className="mb-2 w-full">Add new rule</Button>

								{ RolePingRules.map( ( rule, idx ) => {
									return (
										<div
											className="mt-2 block rounded-lg bg-gray-900 border border-gray-800 flex p-2"
											key={ Id + idx }>
											<Select options={ roleOptions } placeholder="select a role"
											        className="my-react-select-container w-full flex-1 me-1"
											        isClearable={ true }
											        classNamePrefix="my-react-select" isMulti={ false }
											        value={ roleToSelectedSingle( roles, rule.roleId ) }
											        onChange={ e => setRolePingRules( curr => {
												        const arr = _.clone( curr );
												        arr.splice( idx, 1, { ...rule, roleId: e?.value || "" } );
												        return arr;
											        } ) }/>

											<Select options={ modOptions } placeholder="select mods for this role"
											        className="my-react-select-container w-full flex-1 mx-1"
											        isClearable={ true }
											        classNamePrefix="my-react-select" isMulti={ true }
											        value={ modsToSelectionMulti( mods, rule.modRefs ) }
											        onChange={ e => setRolePingRules( curr => {
												        const arr = _.clone( curr );
												        arr.splice( idx, 1, {
													        ...rule,
													        modRefs: e.map( v => v.value )
												        } );
												        return arr;
											        } ) }/>

											<Button color="red" type="button"
											        onClick={ () => setRolePingRules( curr => {
												        const arr = _.clone( curr );
												        arr.splice( idx, 1 );
												        return arr;
											        } ) } fullSized={ false }
											        className="flex-0 me-2 ms-1"><BiTrash size={ 20 }/></Button>
										</div>
									);
								} ) }
							</Tabs.Item>
							<Tabs.Item active={ true } title="Channels" icon={ BiMessage }>

								<div className="mb-3 block">
									<Label value="Announcement channel"/>
								</div>
								<Select options={ textChannelOptions }
								        className="mt-2 mb-3 my-react-select-container w-full"
								        isClearable={ true }
								        classNamePrefix="my-react-select" isMulti={ false }
								        value={ selectedTextChannel }
								        onChange={ setSelectedTextChannel }/>


								<div className="mb-3 block">
									<Label value="Changelog channel (forum only)"/>
								</div>
								<Select options={ forumChannelOptions }
								        className="mt-2 mb-3 my-react-select-container w-full"
								        isClearable={ true }
								        classNamePrefix="my-react-select" isMulti={ false }
								        value={ selectedForumChannel }
								        onChange={ setSelectedForumChannel }/>


								<div className="mb-3 block">
									<Label value="Suggestion channel"/>
								</div>
								<Select options={ bothChannelOptions }
								        className="mt-2 mb-3 my-react-select-container w-full"
								        isClearable={ true }
								        classNamePrefix="my-react-select" isMulti={ false }
								        value={ selectedSuggestionChannel }
								        onChange={ setSelectedSuggestionChannel }/>


								<div className="block">
									<Label value="Bug-report channel"/>
								</div>
								<Select options={ bothChannelOptions } className="mt-2 my-react-select-container w-full"
								        isClearable={ true }
								        classNamePrefix="my-react-select" isMulti={ false } value={ selectedBugChannel }
								        onChange={ setSelectedBugChannel }/>

							</Tabs.Item>
						</Tabs.Group>
						<hr className="border-gray-600"/>
						<div className="p-3 rounded-b-lg">
							<LoadButton isLoading={ isLoading } color="green" type="button" onClick={ onSubmit }
							            icon={ <BiSave size={ 20 } className="me-2"/> }>Save</LoadButton>
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{ watchedMods.map( e => ( <ModWatchRow mods={ mods } watch={ e } key={ Id + e._id }/> ) ) }
			</div>
		</>
	);
};
export {
	Component,
	loader
};