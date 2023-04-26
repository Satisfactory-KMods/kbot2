import {
	Request,
	Response
}                        from "express";
import { EApiAuth }      from "@shared/Enum/EApiPath";
import {
	DefaultResponseFailed,
	DefaultResponseSuccess
}                        from "@shared/Default/Auth.Default";
import {
	TR_Auth_Account_Checkout,
	TR_Auth_Account_Put,
	TR_Auth_Validate_All
}                        from "@shared/types/API_Response";
import {
	ApiUrl,
	MW_Auth
}                        from "@server/lib/Express.Lib";
import DB_RegisterToken  from "@server/mongodb/DB_RegisterToken";
import * as core         from "express-serve-static-core";
import { TERes }         from "@server/types/express";
import {
	TReq_Auth_Account_Checkout,
	TReq_Auth_Account_Put,
	TReq_Auth_Modify_Patch
}                        from "@shared/types/API_Request";
import DB_UserAccount    from "@server/mongodb/DB_UserAccount";
import { CreateSession } from "@server/lib/Session.Lib";
import { ERoles }        from "@shared/Enum/ERoles";
import DB_SessionToken   from "@server/mongodb/DB_SessionToken";

export default function() {
	Router.route( ApiUrl( EApiAuth.validate ) )
		.get( MW_Auth, ( req : Request, res : Response ) => {
			return res.status( 200 ).json( {
				...DefaultResponseSuccess,
				Auth: true
			} as TR_Auth_Validate_All );
		} )
		.checkout( async( req : Request<core.ParamsDictionary, any, { authCode : string, isReset? : boolean }>, res : Response ) => {
			try {
				return res.status( 200 ).json( {
					...DefaultResponseSuccess,
					tokenOk: await DB_RegisterToken.findOne( {
						expire: { $gte: new Date() },
						token: req.body.authCode,
						isPasswordResetToken: !!req.body.isReset
					} ) !== null
				} as TR_Auth_Validate_All );
			}
			catch ( e ) {
				if ( e instanceof Error ) {
					SystemLib.LogError( "api", "Error by reading RegisterToken:", e.message );
				}
			}
			return res.status( 500 ).json( {} );
		} );

	Router.route( ApiUrl( EApiAuth.account ) )
		.put( async( req : TERes<TReq_Auth_Account_Put>, res : Response ) => {
			if ( req.body.token && req.body.password && req.body.username ) {
				try {
					const tokenDoc = await DB_RegisterToken.findOne( {
						expire: { $gte: new Date() },
						token: req.body.token,
						isPasswordResetToken: false
					} );

					if ( tokenDoc ) {
						const Response : TR_Auth_Account_Put = {
							...DefaultResponseFailed,
							Data: {
								token: ""
							}
						};

						const newUserDocument = new DB_UserAccount();
						newUserDocument.discordId = tokenDoc.userId;
						newUserDocument.setPassword( req.body.password );
						newUserDocument.username = req.body.username;
						newUserDocument.role = ERoles.member;

						if ( await newUserDocument.save() ) {
							await DB_RegisterToken.deleteMany( {
								userId: req.body.username,
								isPasswordResetToken: false
							} );

							const Token = await CreateSession( newUserDocument.toJSON() );
							if ( Token ) {
								Response.Success = true;
								Response.Data.token = Token;
								Response.MessageCode = "register.create";
								return res.status( 200 ).json( Response );
							}
							else {
								Response.MessageCode = "auth.token";
								return res.status( 200 ).json( Response );
							}
						}
						else {
							Response.MessageCode = "register.create";
							return res.status( 200 ).json( Response );
						}
					}
				}
				catch ( e ) {
					if ( e instanceof Error ) {
						SystemLib.LogError( "api", "Error by creating account:", e.message );
					}
				}
			}

			return res.status( 500 ).json( {} );
		} )
		.patch( async( req : TERes<TReq_Auth_Modify_Patch>, res : Response ) => {
			if ( req.body.token && req.body.password ) {
				try {
					const tokenDoc = await DB_RegisterToken.findOne( {
						expire: { $gte: new Date() },
						token: req.body.token,
						isPasswordResetToken: true
					} );

					if ( tokenDoc ) {
						const Response : TR_Auth_Account_Put = {
							...DefaultResponseFailed,
							Data: {
								token: ""
							}
						};

						const userDocument = await DB_UserAccount.findOne( { discordId: tokenDoc.userId } );
						if ( userDocument ) {
							userDocument.setPassword( req.body.password );
							if ( await userDocument.save() ) {
								await DB_RegisterToken.deleteMany( {
									userId: tokenDoc.userId,
									isPasswordResetToken: true
								} );
								await DB_SessionToken.deleteMany( {
									userId: userDocument._id.toString()
								} );

								const Token = await CreateSession( userDocument.toJSON() );
								if ( Token ) {
									Response.Success = true;
									Response.Data.token = Token;
									Response.MessageCode = "reset.password";
									return res.status( 200 ).json( Response );
								}
								else {
									Response.MessageCode = "auth.token";
									return res.status( 200 ).json( Response );
								}
							}
							else {
								Response.MessageCode = "reset.save";
								return res.status( 200 ).json( Response );
							}
						}
						else {
							Response.MessageCode = "reset.nouser";
							return res.status( 200 ).json( Response );
						}
					}
				}
				catch ( e ) {
					if ( e instanceof Error ) {
						SystemLib.LogError( "api", "Error by creating account:", e.message );
					}
				}
			}

			return res.status( 500 ).json( {} );
		} )
		.checkout( async( req : TERes<TReq_Auth_Account_Checkout>, res : Response ) => {
			if ( req.body.password && req.body.username ) {
				try {
					const userDocument = await DB_UserAccount.findOne( {
						$or: [
							{ discordId: req.body.username },
							{ username: req.body.username }
						]
					} );

					const Response : TR_Auth_Account_Checkout = {
						...DefaultResponseFailed,
						Data: {
							token: ""
						}
					};

					if ( userDocument ) {
						if ( userDocument.validPassword( req.body.password ) ) {
							await DB_RegisterToken.deleteMany( {
								userId: userDocument.discordId,
								isPasswordResetToken: true
							} );
							await DB_SessionToken.deleteMany( {
								userId: userDocument._id.toString()
							} );

							const Token = await CreateSession( userDocument.toJSON() );
							if ( Token ) {
								Response.Success = true;
								Response.Data.token = Token;
								return res.status( 200 ).json( Response );
							}
							else {
								Response.MessageCode = "auth.token";
								return res.status( 200 ).json( Response );
							}
						}
						else {
							Response.MessageCode = "login.password";
							return res.status( 200 ).json( Response );
						}
					}
					else {
						Response.MessageCode = "login.nouser";
						return res.status( 200 ).json( Response );
					}

				}
				catch ( e ) {
					if ( e instanceof Error ) {
						SystemLib.LogError( "api", "Error by creating account:", e.message );
					}
				}
			}

			return res.status( 500 ).json( {} );
		} );
}
