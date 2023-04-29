import {
	FC,
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
	channelToSelectedSingle,
	channelToSelection,
	modsToSelection,
	rolesToSelection,
	roleToSelectedMulti,
	Selection
}                             from "@lib/selectConversion";
import {
	Label,
	Tabs,
	Textarea
}                             from "flowbite-react";
import {
	BiCog,
	BiMessage,
	BiSave
}                             from "react-icons/all";
import LoadButton             from "@comp/LoadButton";
import Select, { MultiValue } from "react-select";
import useGuild               from "@hooks/useGuild";
import { messageTextLimit }   from "@shared/Default/discord";
import {
	tRCP_handleError,
	tRPC_Guild
}                             from "@lib/tRPC";
import { fireToastFromApi }   from "@lib/sweetAlert";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LoaderData {
}

const loader : LoaderFunction = async( { params } ) => {
	const { guildId } = params;

	return json<LoaderData>( {} );
};

const Component : FC = () => {
	const { guildId } = useParams();
	// eslint-disable-next-line no-empty-pattern
	const {} = useLoaderData() as LoaderData;
	const Id = useId();
	const [ isLoading, setIsLoading ] = useState( false );

	const { textChannels, forumChannels, mods, roles, guildData, triggerGuildUpdate } = useGuild();
	const { patreonOptions } = guildData;

	const [ ficsitUserIds, setFicsitUserIds ] = useState<MultiValue<Selection>>( () => guildData.options.ficsitUserIds.map( id => ( {
		value: id,
		label: id
	} ) ) );

	const roleOptions = useMemo( () => rolesToSelection( roles ), [ roles ] );
	const textChannelOptions = useMemo( () => channelToSelection( textChannels ), [ textChannels ] );
	const forumChannelOptions = useMemo( () => channelToSelection( forumChannels ), [ forumChannels ] );
	const modOptions = useMemo( () => modsToSelection( mods.filter( e => ficsitUserIds.map( e => e.value ).includes( e.creator_id ) ) ), [ mods, ficsitUserIds ] );

	const [ announcementChannel, setAnnouncementChannel ] = useState( () => channelToSelectedSingle( textChannels, patreonOptions?.announcementChannel || "" ) );
	const [ changelogForum, setChangelogForum ] = useState( () => channelToSelectedSingle( textChannels, patreonOptions?.changelogForum || "" ) );
	const [ pingRoles, setPingRoles ] = useState( () => roleToSelectedMulti( roles, patreonOptions?.pingRoles || [] ) );
	const [ patreonReleaseText, setPatreonReleaseText ] = useState( () => patreonOptions?.patreonReleaseText || "" );

	const saveSettings = async() => {
		setIsLoading( true );
		const response = await tRPC_Guild.patreon.updateSettings.mutate( {
			guildId: guildId!,
			patreonReleaseText,
			announcementChannel: announcementChannel?.value || "0",
			changelogForum: changelogForum?.value || "0",
			pingRoles: pingRoles.map( e => e.value )
		} ).catch( tRCP_handleError );

		if ( response ) {
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
							<Tabs.Item active={ true } title="Settings"
							           icon={ BiCog }>
								<div className="mb-3 block">
									<Label value="Patreon Roles"/>
								</div>
								<Select options={ roleOptions }
								        className="mt-2 mb-3 my-react-select-container w-full"
								        isClearable={ true }
								        classNamePrefix="my-react-select" isMulti={ true } value={ pingRoles }
								        onChange={ setPingRoles }/>

								<div className="mb-3 block">
									<Label value="Announcement channel"/>
								</div>
								<Select options={ textChannelOptions }
								        className="mt-2 mb-3 my-react-select-container w-full"
								        isClearable={ true }
								        classNamePrefix="my-react-select" isMulti={ false }
								        value={ announcementChannel }
								        onChange={ setAnnouncementChannel }/>

								<div className="mb-3 block">
									<Label value="Changelog forum"/>
								</div>
								<Select options={ forumChannelOptions }
								        className="mt-2 mb-3 my-react-select-container w-full"
								        isClearable={ true }
								        classNamePrefix="my-react-select" isMulti={ false } value={ changelogForum }
								        onChange={ setChangelogForum }/>

								<div className="mb-3 block">
									<Label value="Release Text"/>
								</div>
								<Textarea className="mt-2 mb-3" rows={ 6 } value={ patreonReleaseText }
								          helperText={ `Symbols left: ${ messageTextLimit - patreonReleaseText.length }` }
								          onChange={ e => setPatreonReleaseText( e.target.value ) }/>

								<hr className="border-gray-600 mt-3"/>
								<div className="p-3 rounded-b-lg">
									<LoadButton isLoading={ isLoading } color="green" type="button"
									            onClick={ saveSettings }
									            icon={ <BiSave size={ 20 }
									                           className="me-2"/> }>Save</LoadButton>
								</div>
							</Tabs.Item>
							<Tabs.Item title="Channels" icon={ BiMessage }>


							</Tabs.Item>
						</Tabs.Group>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{/* watchedMods.map( e => ( <ModWatchRow mods={ mods } watch={ e } key={ Id + e._id }/> ) )*/ }
			</div>
		</>
	);
};
export {
	Component,
	loader
};