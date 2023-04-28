import {
	FunctionComponent,
	useContext,
	useMemo
}                   from "react";
import {
	MO_Mod,
	MO_ModUpdate
}                   from "@shared/types/MongoDB";
import GuildContext from "@context/GuildContext";

interface ModWatchRowProps {
	mods : MO_Mod[],
	watch : MO_ModUpdate
}

const ModWatchRow : FunctionComponent<ModWatchRowProps> = ( { mods, watch } ) => {
	const { guildData } = useContext( GuildContext );

	const mod = useMemo( () => mods.find( m => m.mod_reference === watch.modRef ), [ mods, watch ] );

	if ( !mod || mod.authors.find( u => guildData.options.ficsitUserIds.includes( u.user_id ) ) === undefined ) {
		return null;
	}

	return (
		<div className="flex font-sans bg-gray-800 border-gray-600 border rounded-xl">
			<div className="flex-none w-28 relative border-gray-600">
				<img src={ mod.logo || "/images/invalid.png" } alt=""
				     className="absolute inset-0 w-full h-full object-cover rounded-l-lg"
				     loading="lazy"/>
			</div>
			<form className="flex-auto p-6">
				<div className="flex flex-wrap">
					<h1 className="flex-auto text-lg font-semibold text-slate-300">
						{ mod.name }
					</h1>
				</div>

				<p className="text-sm text-slate-400">
					Last update: <b>{ new Date( mod.versions[ 0 ]?.created_at ).toLocaleDateString() }</b>
				</p>

				<p className="text-sm text-slate-400">
					Last version: <b>{ mod.versions[ 0 ]?.version || "no version" }</b>
				</p>
			</form>
		</div>
	);
};

export default ModWatchRow;
