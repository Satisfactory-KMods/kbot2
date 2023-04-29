import {
	FC,
	useMemo,
	useState
}                          from "react";
import { modsToSelection } from "@lib/selectConversion";
import useGuild            from "@hooks/useGuild";


interface PatreonReleaseInputProps {
	onReleaseAdded : () => void;
}

const PatreonReleaseInput : FC<PatreonReleaseInputProps> = ( { onReleaseAdded } ) => {
	const { mods, guildData } = useGuild();
	const modOptions = useMemo( () => modsToSelection( mods.filter( e => guildData.options.ficsitUserIds?.includes( e.creator_id ) ) ), [ mods, guildData ] );
	const [ isLoading, setIsLoading ] = useState( false );


	const upload = async() => {
		setIsLoading( true );
		setIsLoading( false );
	};

	return (
		<></>
	);
};

export default PatreonReleaseInput;
