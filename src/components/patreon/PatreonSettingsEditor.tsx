import LoadButton from '@comp/LoadButton';
import useGuild from '@hooks/useGuild';
import useSelection from '@hooks/useSelection';
import { channelToSelectedSingle, roleToSelectedMulti } from '@lib/selectConversion';
import { fireToastFromApi } from '@lib/sweetAlert';
import { tRPC_Guild, tRPC_handleError } from '@lib/tRPC';
import { messageTextLimit } from '@shared/Default/discord';
import { Label, Textarea } from 'flowbite-react';
import { FC, useState } from 'react';
import { BiSave } from 'react-icons/bi';
import { useParams } from 'react-router-dom';
import Select from 'react-select';

const PatreonSettingsEditor: FC = () => {
	const { forumChannelOptions, textChannelOptions, roleOptions } = useSelection();
	const { guildId } = useParams();
	const [isLoading, setIsLoading] = useState(false);

	const { textChannels, forumChannels, roles, guildData, triggerGuildUpdate } = useGuild();
	const { patreonOptions } = guildData;

	const [announcementChannel, setAnnouncementChannel] = useState(() =>
		channelToSelectedSingle(textChannels, patreonOptions?.announcementChannel || '')
	);
	const [changelogForum, setChangelogForum] = useState(() => channelToSelectedSingle(forumChannels, patreonOptions?.changelogForum || ''));
	const [pingRoles, setPingRoles] = useState(() => roleToSelectedMulti(roles, patreonOptions?.pingRoles || []));
	const [patreonReleaseText, setPatreonReleaseText] = useState(() => patreonOptions?.patreonReleaseText || '');

	const saveSettings = async () => {
		setIsLoading(true);
		const response = await tRPC_Guild.patreon.updateSettings
			.mutate({
				guildId: guildId!,
				patreonReleaseText,
				announcementChannel: announcementChannel?.value || '0',
				changelogForum: changelogForum?.value || '0',
				pingRoles: pingRoles.map((e) => e.value)
			})
			.catch(tRPC_handleError);
		setIsLoading(false);

		if (response) {
			fireToastFromApi(response.message, true);
			await triggerGuildUpdate();
		}
	};

	return (
		<>
			<div className='mb-3 block'>
				<Label value='Patreon Roles' />
			</div>
			<Select
				options={roleOptions}
				className='my-react-select-container mb-3 mt-2 w-full'
				isClearable={true}
				classNamePrefix='my-react-select'
				isMulti={true}
				value={pingRoles}
				onChange={setPingRoles}
			/>

			<div className='mb-3 block'>
				<Label value='Announcement channel' />
			</div>
			<Select
				options={textChannelOptions}
				className='my-react-select-container mb-3 mt-2 w-full'
				isClearable={true}
				classNamePrefix='my-react-select'
				isMulti={false}
				value={announcementChannel}
				onChange={setAnnouncementChannel}
			/>

			<div className='mb-3 block'>
				<Label value='Changelog forum' />
			</div>
			<Select
				options={forumChannelOptions}
				className='my-react-select-container mb-3 mt-2 w-full'
				isClearable={true}
				classNamePrefix='my-react-select'
				isMulti={false}
				value={changelogForum}
				onChange={setChangelogForum}
			/>

			<div className='mb-3 block'>
				<Label value='Release Text' />
			</div>
			<Textarea
				className='mb-3 mt-2'
				rows={6}
				value={patreonReleaseText}
				helperText={`Symbols left: ${messageTextLimit - patreonReleaseText.length}`}
				onChange={(e) => setPatreonReleaseText(e.target.value)}
			/>

			<hr className='mt-3 border-gray-600' />
			<div className='rounded-b-lg p-3'>
				<LoadButton isLoading={isLoading} color='green' type='button' onClick={saveSettings} icon={<BiSave size={20} className='me-2' />}>
					Save
				</LoadButton>
			</div>
		</>
	);
};

export default PatreonSettingsEditor;
