import PatreonReleaseInput from "@comp/patreon/PatreonReleaseInput";
import PatreonSettingsEditor from "@comp/patreon/PatreonSettingsEditor";
import { Tabs } from "flowbite-react";
import { FC } from "react";
import {
	BiCog,
	BiUpload
} from "react-icons/bi";

const Component : FC = () => {
	return (
		<>
			<div
				className="flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col w-full p-0 mb-4">
				<div className="flex h-full flex-col justify-center gap-4 p-0">
					<div className="flex flex-col gap-2">
						<Tabs.Group style="underline">
							<Tabs.Item active={ true } title="Settings"
							           icon={ BiCog }>
								<PatreonSettingsEditor/>
							</Tabs.Item>
							<Tabs.Item title="Upload Release" icon={ BiUpload }>
								<PatreonReleaseInput onReleaseAdded={ () => {
								} }/>
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
	Component
};
