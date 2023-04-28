export interface StringGroup extends Record<string, string[]> {
	Data : string [];
}

export function BuildStringGroup( String : string, MaxPerGroup = 100 ) : StringGroup[] | undefined {
	const StringGroups : StringGroup[] = [];

	if ( String.length <= MaxPerGroup ) {
		const Group : StringGroup = {
			Data: String.split( /\r?\n/ )
		};
		StringGroups.push( Group );
		return StringGroups;
	}
	else {
		for ( let Idx = 0; Idx < Math.ceil( String.length / MaxPerGroup ) + 20; ++Idx ) {
			StringGroups.push( {
				Data: []
			} );
		}

		let LastGroupIdx = 0;
		for ( const Line of String.split( /\r?\n/ ) ) {
			if ( Line.length + 4 > MaxPerGroup ) {
				SystemLib.LogError( "grouping", "Line.length + 4 > MaxPerGroup" );
				return undefined;
			}

			const CurrenGroupCounter = GroupToString( StringGroups[ LastGroupIdx ] ).length;
			const LineCount = StringGroups[ LastGroupIdx ].Data.length == 0 ? Line.length : Line.length + 4;
			const NextGroupCount = CurrenGroupCounter + LineCount;

			if ( NextGroupCount > MaxPerGroup ) {
				LastGroupIdx++;
			}

			const Idx = LastGroupIdx;
			StringGroups[ Idx ].Data.push( Line );
		}
	}

	return StringGroups;
}

export function GroupToString( Group : StringGroup ) : string {
	return Group.Data.join( "\r\n" );
}