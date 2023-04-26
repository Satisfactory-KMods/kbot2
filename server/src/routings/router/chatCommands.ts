import { Response }         from "express";
import { EApiChatCommands } from "@shared/Enum/EApiPath";
import {
	DefaultResponseFailed,
	DefaultResponseSuccess
}                           from "@shared/Default/Auth.Default";
import {
	TR_Auth_Validate_All,
	TR_CC_Question_GET,
	TR_CC_Question_PUT
}                           from "@shared/types/API_Response";
import {
	ApiUrl,
	MW_AuthGuild
}                           from "@server/lib/Express.Lib";
import { TEResG }           from "@server/types/express";
import {
	TReq_CC_Question_DELETE,
	TReq_CC_Question_GET,
	TReq_CC_Question_PATCH,
	TReq_CC_Question_PUT
}                           from "@shared/types/API_Request";
import DB_ChatCommands      from "@server/mongodb/DB_ChatCommands";

export default function() {
	Router.route( ApiUrl( EApiChatCommands.question ) )
		.get( MW_AuthGuild, async( req : TEResG<TReq_CC_Question_GET>, res : Response ) => {
			try {
				return res.status( 200 ).json( {
					...DefaultResponseSuccess,
					Data: await DB_ChatCommands.find( { guildId: req.body.guild.getGuild?.id } )
				} as TR_CC_Question_GET );
			}
			catch ( e ) {
				if ( e instanceof Error ) {
					SystemLib.LogError( "api", e.message );
				}
			}
			return res.status( 500 ).json( {
				...DefaultResponseFailed
			} as TR_Auth_Validate_All );
		} )
		.put( MW_AuthGuild, async( req : TEResG<TReq_CC_Question_PUT>, res : Response ) => {
			try {
				if ( !!req.body.command?.length && req.body.alias !== undefined && req.body.autoReactionMatches !== undefined && !!req.body.reactionText?.length ) {
					const command = await DB_ChatCommands.findOne( {
						command: req.body.command,
						guildId: req.body.guild.guildId
					} );
					if ( !command ) {
						const newCommand = new DB_ChatCommands();
						newCommand.guildId = req.body.guild.guildId;
						newCommand.command = req.body.command;
						newCommand.alias = req.body.alias || [];
						newCommand.autoReactionMatches = req.body.autoReactionMatches || [];
						newCommand.reactionText = req.body.reactionText;
						if ( await newCommand.save() ) {
							return res.status( 200 ).json( {
								...DefaultResponseSuccess,
								MessageCode: "cc.created",
								Data: newCommand
							} as TR_CC_Question_PUT );
						}
						else {
							return res.status( 500 ).json( {
								...DefaultResponseSuccess,
								MessageCode: "failed.save"
							} as TR_CC_Question_PUT );
						}
					}
					else {
						return res.status( 500 ).json( {
							...DefaultResponseSuccess,
							MessageCode: "cc.duplicate"
						} as TR_CC_Question_PUT );
					}
				}
				return res.status( 500 ).json( {
					...DefaultResponseSuccess,
					MessageCode: "failed.input"
				} as TR_CC_Question_PUT );
			}
			catch ( e ) {
				if ( e instanceof Error ) {
					SystemLib.LogError( "api", e.message );
				}
			}
			return res.status( 500 ).json( {
				...DefaultResponseFailed
			} as TR_Auth_Validate_All );
		} )
		.patch( MW_AuthGuild, async( req : TEResG<TReq_CC_Question_PATCH>, res : Response ) => {
			try {
				if ( !!req.body._id?.length && !!req.body.command?.length && req.body.alias !== undefined && req.body.autoReactionMatches !== undefined && !!req.body.reactionText?.length ) {
					let command = await DB_ChatCommands.findById( req.body._id );
					if ( command ) {
						if ( command.command !== req.body.command ) {
							const checkCommand = await DB_ChatCommands.findOne( {
								command: req.body.command,
								guildId: req.body.guild.guildId
							} );
							if ( checkCommand ) {
								return res.status( 500 ).json( {
									...DefaultResponseSuccess,
									MessageCode: "cc.duplicate"
								} as TR_CC_Question_PUT );
							}
						}


						command.guildId = req.body.guild.guildId;
						command.command = req.body.command;
						command.alias = req.body.alias || [];
						command.autoReactionMatches = req.body.autoReactionMatches || [];
						command.reactionText = req.body.reactionText;
						if ( await command.save() ) {
							command = await DB_ChatCommands.findOne( {
								command: req.body.command,
								guildId: req.body.guild.guildId
							} );
							return res.status( 200 ).json( {
								...DefaultResponseSuccess,
								MessageCode: "cc.modified",
								Data: command!
							} as TR_CC_Question_PUT );
						}
						else {
							return res.status( 500 ).json( {
								...DefaultResponseSuccess,
								MessageCode: "failed.save"
							} as TR_CC_Question_PUT );
						}
					}
				}
				return res.status( 500 ).json( {
					...DefaultResponseSuccess,
					MessageCode: "failed.input"
				} as TR_CC_Question_PUT );
			}
			catch ( e ) {
				if ( e instanceof Error ) {
					SystemLib.LogError( "api", e.message );
				}
			}
			return res.status( 500 ).json( {
				...DefaultResponseFailed
			} as TR_Auth_Validate_All );
		} )
		.delete( MW_AuthGuild, async( req : TEResG<TReq_CC_Question_DELETE>, res : Response ) => {
			try {
				if ( req.body._id?.length ) {
					const command = await DB_ChatCommands.findById( req.body._id );
					if ( command && await command.deleteOne() ) {
						return res.status( 200 ).json( {
							...DefaultResponseSuccess,
							MessageCode: "cc.modified",
							Data: command!
						} as TR_CC_Question_PUT );
					}
					return res.status( 500 ).json( {
						...DefaultResponseSuccess,
						MessageCode: "failed.input"
					} as TR_CC_Question_PUT );
				}
			}
			catch ( e ) {
				if ( e instanceof Error ) {
					SystemLib.LogError( "api", e.message );
				}
			}
			return res.status( 500 ).json( {
				...DefaultResponseFailed
			} as TR_Auth_Validate_All );
		} );
}
