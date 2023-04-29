import { FC }                from "react";
import {
	json,
	LoaderFunction,
	useLoaderData,
	useParams
}                            from "react-router-dom";
import { Tabs }              from "flowbite-react";
import {
	BiCog,
	BiUpload
}                            from "react-icons/all";
import PatreonSettingsEditor from "@comp/patreon/PatreonSettingsEditor";
import PatreonReleaseInput   from "@comp/patreon/PatreonReleaseInput";

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
								<PatreonReleaseInput/>
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