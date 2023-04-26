import { TApiPath }              from "@shared/Enum/EApiPath";
import {
	Request,
	Response
}                                from "express";
import { Connect }               from "vite";
import { ResponseBase }          from "@shared/types/API_Response";
import { DefaultResponseFailed } from "@shared/Default/Auth.Default";
import DB_SessionToken           from "@server/mongodb/DB_SessionToken";
import { User }                  from "@shared/class/User.Class";
import * as jwt                  from "jsonwebtoken";
import { ERoles }                from "@shared/Enum/ERoles";
import { TEResG }                from "@server/types/express";
import { DiscordGuildManager }   from "@server/lib/bot/guild.lib";
import NextFunction = Connect.NextFunction;

export function ApiUrl( Url : TApiPath | string ) {
	SystemLib.Log( "URL", "Routing registered:", SystemLib.ToBashColor( "Red" ), Url );
	return Url;
}

// middleware to check the JWT token for
export async function MW_Auth( req : Request, res : Response, next : NextFunction ) {
	const Response : ResponseBase = {
		...DefaultResponseFailed,
		MessageCode: "unauthorized"
	};

	req.body = {
		...req.body,
		...req.query
	};

	const AuthHeader = req.headers.authorization;
	let Token : string | undefined;
	try {
		Token = AuthHeader && AuthHeader.split( " " )[ 1 ].replaceAll( "\"", "" );
	}
	catch ( e ) {
	}

	if ( Token ) {
		try {
			const Result = jwt.verify( Token, process.env.JWTToken as string );
			if ( typeof Result === "object" ) {
				const UserData = new User( Token );
				const Session = await DB_SessionToken.findOne( { token: Token, userid: UserData.Get._id } );
				if ( Session ) {
					req.body.UserClass = UserData;
					next();
					return;
				}
			}
		}
		catch ( e ) {
		}
	}
	res.json( Response );
}

export async function MW_AuthGuild( req : TEResG, res : Response, next : NextFunction ) {
	const Response : ResponseBase = {
		...DefaultResponseFailed,
		MessageCode: "unauthorized"
	};

	req.body = {
		...req.body,
		...req.query
	};

	const AuthHeader = req.headers.authorization;
	let Token : string | undefined;
	try {
		Token = AuthHeader && AuthHeader.split( " " )[ 1 ].replaceAll( "\"", "" );
	}
	catch ( e ) {
	}

	if ( Token ) {
		try {
			const Result = jwt.verify( Token, process.env.JWTToken as string );
			if ( typeof Result === "object" ) {
				const UserData = new User( Token );
				const Session = await DB_SessionToken.findOne( { token: Token, userid: UserData.Get._id } );
				if ( Session ) {
					req.body.UserClass = UserData;
					if ( req.body.guildId ) {
						const guild = await DiscordGuildManager.GetGuild( req.body.guildId );
						if ( guild ) {
							const Data = await guild.getGuildDb();
							if ( Data?.isInGuild && await guild.userHasPermission( req.body.UserClass.Get.discordId ) ) {
								req.body.guild = guild;
								return next();
							}
						}
					}
				}
			}
		}
		catch ( e ) {
		}
	}
	res.json( Response );
}

export async function MW_Permission( req : Request, res : Response, next : NextFunction, Permission : ERoles ) {
	const Response : ResponseBase = {
		...DefaultResponseFailed,
		MessageCode: "unauthorized"
	};
	if ( req.body.UserClass && req.body.UserClass.HasPermssion( Permission ) ) {
		next();
		return;
	}
	res.json( Response );
}
