import React, {
	FC,
	useEffect,
	useMemo,
	useState
}                              from "react";
import {
	modsToSelection,
	Selection
}                              from "@lib/selectConversion";
import useGuild                from "@hooks/useGuild";
import {
	FileInput,
	Label,
	Textarea,
	TextInput
}                              from "flowbite-react";
import Select, { SingleValue } from "react-select";
import LoadButton              from "@comp/LoadButton";
import { BiUpload }            from "react-icons/all";
import {
	tRPC_handleError,
	tRPC_token
}                              from "@lib/tRPC";
import { fireToastFromApi }    from "@lib/sweetAlert";


interface PatreonReleaseInputProps {
	onReleaseAdded : () => void;
}

const PatreonReleaseInput : FC<PatreonReleaseInputProps> = ( { onReleaseAdded } ) => {
	const { mods, guildData, guildId } = useGuild();
	const modOptions = useMemo( () => modsToSelection( mods.filter( e => guildData.options.ficsitUserIds?.includes( e.creator_id ) ) ), [ mods, guildData ] );
	const [ isLoading, setIsLoading ] = useState( false );

	const [ selectedMod, setSelectedMod ] = useState<SingleValue<Selection<string>>>( null );
	const [ changelogContent, setChangelogContent ] = useState( "" );
	const [ version, setVersion ] = useState( "" );
	const [ selectedFile, setSelectedFile ] = useState<File | null>( null );
	const [ fileIsSelected, setFileIsSelected ] = useState( false );

	const handleFileSelect = ( event : React.ChangeEvent<HTMLInputElement> ) => {
		const file = event.target.files?.item( 0 );
		if ( file && file.name.endsWith( ".zip" ) ) {
			setSelectedFile( file || null );
			setFileIsSelected( !!file );
			return;
		}
		setSelectedFile( null );
		setFileIsSelected( false );
	};

	const upload = async() => {
		setIsLoading( true );
		if ( selectedFile ) {
			const body = new FormData();
			body.append( "file", selectedFile );
			body.append( "guildId", guildId );
			body.append( "modRef", selectedMod?.value || "" );
			body.append( "changelogContent", changelogContent );
			body.append( "version", version );

			const response = await fetch( "/api/v1/upload/patreon", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${ tRPC_token() }`
				},
				body
			} ).then( r => r.json() ).catch( tRPC_handleError );

			if ( !response ) {
				fireToastFromApi( "Something goes wrong!" );
			}
			else {
				fireToastFromApi( response.message, response.success );
			}
		}
		setIsLoading( false );
	};

	const clearAll = () => {
		setSelectedMod( null );
		setChangelogContent( "" );
		setVersion( "" );
	};

	useEffect( () => {
		if ( selectedMod ) {
			const mod = mods.find( e => e.mod_reference === selectedMod.value );
			if ( mod && mod.versions?.length > 0 ) {
				setVersion( mod.versions[ 0 ].version );
			}
		}
	}, [ selectedMod, mods ] );

	return (
		<>
			<div className="mb-3 block">
				<Label value="Patreon Roles"/>
			</div>
			<Select options={ modOptions }
			        className="mt-2 mb-3 my-react-select-container w-full"
			        isClearable={ true }
			        classNamePrefix="my-react-select" isMulti={ false } value={ selectedMod }
			        onChange={ setSelectedMod }/>

			<div className="mb-3 block">
				<Label value="Version"/>
			</div>
			<TextInput className="mt-2 mb-3" value={ version } onChange={ e => setChangelogContent( e.target.value ) }/>

			<div className="mb-3 block">
				<Label value="Changelog"/>
			</div>
			<Textarea className="mt-2 mb-3" rows={ 6 } value={ changelogContent }
			          onChange={ e => setChangelogContent( e.target.value ) }/>

			<div className="mb-3 block">
				<Label value="File"/>
			</div>
			<FileInput className="mt-2 mb-3" accept="zip" onChange={ handleFileSelect }/>

			<hr className="border-gray-600 mt-3"/>
			<div className="p-3 rounded-b-lg">
				<LoadButton isLoading={ isLoading } color="green" type="button"
				            onClick={ upload } disabled={ !fileIsSelected }
				            icon={ <BiUpload size={ 20 }
				                             className="me-2"/> }>Upload</LoadButton>
			</div>
		</>
	);
};

export default PatreonReleaseInput;
