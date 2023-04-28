import { z }               from "zod";
import { TRPCError }       from "@trpc/server";
import DB_RegisterToken    from "@server/mongodb/DB_RegisterToken";
import { handleTRCPErr }   from "@server/lib/Express.Lib";
import DB_UserAccount      from "@server/mongodb/DB_UserAccount";
import { CreateSession }   from "@server/lib/Session.Lib";
import { ERoles }          from "@shared/Enum/ERoles";
import { publicProcedure } from "@server/trpc/trpc";

export const public_createAccount =
	publicProcedure.input( z.object( {
		username: z.string().min( 6, { message: "Username is to short." } ),
		password: z.string().min( 8, { message: "Password is to short." } ),
		token: z.string().min( 20, { message: "Token is to short" } )
	} ) ).mutation<{
		token : string;
		message : string;
	}>( async( { input } ) => {
		const { password, token, username } = input;
		try {
			const tokenDocument = await DB_RegisterToken.findOne( {
				token,
				expire: { $gte: new Date() },
				isPasswordResetToken: false
			} );
			if ( !tokenDocument ) {
				throw new TRPCError( { message: "Token is invalid!", code: "BAD_REQUEST" } );
			}

			if ( !await DB_UserAccount.exists( {
				$or: [
					{ username },
					{ discordId: tokenDocument.userId }
				]
			} ) ) {
				const userDocument = new DB_UserAccount();

				userDocument.role = ERoles.member;
				userDocument.username = username;
				userDocument.discordId = tokenDocument.userId;
				userDocument.setPassword( password );

				if ( await userDocument.save() ) {
					const token = await CreateSession( userDocument.toJSON() );
					if ( token ) {
						await DB_RegisterToken.deleteMany( {
							$or: [
								{ userId: tokenDocument.userId },
								{ expire: { $lte: new Date() } }
							]
						} );
						return {
							token: token,
							message: "Account created and logged in successfully!"
						};
					}
					throw new TRPCError( { message: "Error by creating Token!", code: "INTERNAL_SERVER_ERROR" } );
				}
				throw new TRPCError( { message: "User can't saved!", code: "INTERNAL_SERVER_ERROR" } );
			}
		}
		catch ( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	} );