import PatreonReleaseInput from '@comp/patreon/PatreonReleaseInput';
import PatreonSettingsEditor from '@comp/patreon/PatreonSettingsEditor';
import { Tabs } from 'flowbite-react';
import { FC } from 'react';
import { BiCog, BiUpload } from 'react-icons/bi';

const Component: FC = () => {
	return (
		<>
			<div className='mb-4 flex w-full flex-col rounded-lg border border-gray-200 bg-white p-0 shadow-md dark:border-gray-700 dark:bg-gray-800'>
				<div className='flex h-full flex-col justify-center gap-4 p-0'>
					<div className='flex flex-col gap-2'>
						<Tabs style='underline'>
							<Tabs.Item active={true} title='Settings' icon={BiCog}>
								<div className='p-2 px-4'>
									<PatreonSettingsEditor />
								</div>
							</Tabs.Item>
							<Tabs.Item title='Upload Release' icon={BiUpload}>
								<div className='p-2 px-4'>
									<PatreonReleaseInput onReleaseAdded={() => {}} />
								</div>
							</Tabs.Item>
						</Tabs>
					</div>
				</div>
			</div>

			<div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
				{/* watchedMods.map( e => ( <ModWatchRow mods={ mods } watch={ e } key={ Id + e._id }/> ) )*/}
			</div>
		</>
	);
};
export { Component };
