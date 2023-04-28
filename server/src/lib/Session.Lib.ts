import * as jwt           from "jsonwebtoken";
import { MO_UserAccount } from "@shared/types/MongoDB";
import DB_SessionToken    from "@server/mongodb/DB_SessionToken";

// create a new session token and register it in the database
// if the token is not registered in the database the token will be invalid too. (small protection to modify the token)
export async function CreateSession( User : Partial<MO_UserAccount>, stayLoggedIn? : boolean ) : Promise<string | undefined> {
	delete User.__v;
	delete User.salt;
	delete User.hash;
	try {
		const Token = jwt.sign( User, process.env.JWTToken || "", {
			expiresIn: stayLoggedIn ? "28d" : "1d"
		} );
		const Decoded = jwt.verify( Token, process.env.JWTToken || "" ) as jwt.JwtPayload;
		if ( Decoded ) {
			await DB_SessionToken.deleteMany( { expire: { $lte: new Date() } } );
			await DB_SessionToken.create( {
				token: Token,
				userid: User._id,
				expire: new Date( ( Decoded.exp || 0 ) * 1000 )
			} );
			return Token;
		}
	}
	catch ( e ) {
		if ( e instanceof Error ) {
			SystemLib.LogError( e.message );
		}
	}
	return undefined;
}
