import { TApiPath }            from "@shared/Enum/EApiPath";
import {
	Request,
	Response
}                              from "express";
import { Connect }             from "vite";
import DB_SessionToken         from "@server/mongodb/DB_SessionToken";
import { User }                from "@shared/class/User.Class";
import * as jwt                from "jsonwebtoken";
import { DiscordGuildManager } from "@server/lib/bot/guild.lib";
import { TRPCError }           from "@trpc/server";
import NextFunction = Connect.NextFunction;

export function ApiUrl( Url : TApiPath | string ) {
	SystemLib.Log( "URL", "Routing registered:", SystemLib.ToBashColor( "Red" ), Url );
	return Url;
}

// middleware to check the JWT token for
export async function MW_Auth( req : Request, res : Response, next : NextFunction ) {
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
	res.status( 401 ).json( {
		"error": {
			"message": "unauthorized",
			"code": -32001,
			"data": {
				"code": "unauthorized",
				"httpStatus": 401,
				"stack": "",
				"path": "error"
			}
		}
	} );
}

export async function MW_AuthGuild( req : Request, res : Response, next : NextFunction ) {
	req.body = {
		...req.body,
		...req.query
	};

	const AuthHeader = req.headers.authorization;
	let Token : string | undefined;
	try {
		Token = AuthHeader && AuthHeader.split( " " )[ 1 ].replaceAll( "\"", "" ).clearWs();
		if ( req.method === "GET" ) {
			req.body.guildId = JSON.parse( req.body.input )[ "0" ][ "json" ].guildId;
		}
		else {
			req.body.guildId = req.body[ "0" ]?.guildId;
		}
	}
	catch ( e ) {
	}

	if ( Token ) {
		try {
			const Result = jwt.verify( Token, process.env.JWTToken! );
			if ( typeof Result === "object" ) {
				const UserData = new User( Token );
				const Session = await DB_SessionToken.findOne( { token: Token, userid: UserData.Get._id } );
				if ( Session ) {
					req.body.UserClass = UserData;
					req.body.JsonWebToken = Token;
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
			// @ts-ignore
			console.log( e.message );
		}
	}
	res.status( 401 ).json( {
		"error": {
			"message": "unauthorized",
			"code": -32001,
			"data": {
				"code": "unauthorized",
				"httpStatus": 401,
				"stack": "",
				"path": "error"
			}
		}
	} );
}


export function handleTRCPErr( e : unknown ) {
	if ( e instanceof TRPCError ) {
		throw new TRPCError( { message: e.message, code: e.code } );
	}
	else if ( e instanceof Error ) {
		SystemLib.LogError( "tRCP", e.message );
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	}
}