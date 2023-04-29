import {
	FC,
	useMemo,
	useState
}                           from "react";
import { useParams }        from "react-router-dom";
import useGuild             from "@hooks/useGuild";
import {
	channelToSelectedSingle,
	channelToSelection,
	rolesToSelection,
	roleToSelectedMulti
}                           from "@lib/selectConversion";
import {
	Label,
	Textarea
}                           from "flowbite-react";
import Select               from "react-select";
import { messageTextLimit } from "@shared/Default/discord";
import LoadButton           from "@comp/LoadButton";
import { BiSave }           from "react-icons/all";
import {
	tRCP_handleError,
	tRPC_Guild
}                           from "@lib/tRPC";
import { fireToastFromApi } from "@lib/sweetAlert";


const PatreonSettingsEditor : FC = () => {
	const { guildId } = useParams();
	const [ isLoading, setIsLoading ] = useState( false );

	const { textChannels, forumChannels, roles, guildData, triggerGuildUpdate } = useGuild();
	const { patreonOptions } = guildData;

	const roleOptions = useMemo( () => rolesToSelection( roles ), [ roles ] );
	const textChannelOptions = useMemo( () => channelToSelection( textChannels ), [ textChannels ] );
	const forumChannelOptions = useMemo( () => channelToSelection( forumChannels ), [ forumChannels ] );

	const [ announcementChannel, setAnnouncementChannel ] = useState( () => channelToSelectedSingle( textChannels, patreonOptions?.announcementChannel || "" ) );
	const [ changelogForum, setChangelogForum ] = useState( () => channelToSelectedSingle( forumChannels, patreonOptions?.changelogForum || "" ) );
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
		setIsLoading( false );

		if ( response ) {
			fireToastFromApi( response.message, true );
			await triggerGuildUpdate();
		}
	};

	return (
		<>
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
		</>
	);
};

export default PatreonSettingsEditor;
