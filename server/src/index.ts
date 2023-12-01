import * as path            from "path";
import http                 from "http";
import express              from "express";
import process              from "process";
import * as mongoose        from "mongoose";
import "@kyri123/k-javascript-utils/lib/useAddons";
import fs                   from "fs";
import fileUpload           from "express-fileupload";
import {
	BC,
	SystemLib_Class
}                           from "@server/lib/System.Lib";
import { TaskManagerClass } from "@server/tasks/TaskManager";
import { Revalidate }       from "@server/mongodb/DB_Guilds";
import * as console         from "console";

global.__BaseDir = __dirname;
global.__RootDir = process.cwd();
global.__MountDir = path.join( __RootDir, "mount" );
( !fs.existsSync( path.join( __MountDir, "Logs" ) ) ) && fs.mkdirSync( path.join( __MountDir, "Logs" ), { recursive: true } );
global.__LogFile = path.join( __MountDir, "Logs", `${ Date.now() }.log` );

global.SystemLib = new SystemLib_Class();
SystemLib.Log( "Start", "SystemLib was created" );

SystemLib.Log( "Start", "Create apps" );
global.Api = express();
global.HttpServer = http.createServer( global.Api );

SystemLib.Log( "Start", "Configure express app" );
Api.use( express.json() );
Api.use( express.urlencoded( { extended: true } ) );
Api.use( fileUpload( {
	useTempFiles: true,
	tempFileDir: "/tmp/"
} ) );
Api.use( express.static( path.join( __BaseDir, "../..", "dist" ), { extensions: [ "js" ] } ) );

Api.use( function( req, res, next ) {
	if ( SystemLib_Class.IsDev() ) {
		console.log( req.method, req.url );
	}

	res.setHeader( "Access-Control-Allow-Origin", "*" );
	res.setHeader( "Access-Control-Allow-Methods", "GET, POST" );
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-Requested-With,content-type"
	);
	res.setHeader( "Access-Control-Allow-Credentials", "true" );
	next();
} );


mongoose
	.connect(
		`mongodb://${ process.env.MONGO_HOST }:${ process.env.MONGO_PORT }`,
		{
			user: process.env.MONGO_USER,
			pass: process.env.MONGO_PASSWORD,
			dbName: process.env.MONGODB_DATABASE
		}
	)
	.then( async() => {
		SystemLib.Log( "Revalidate", "MongoDB" );
		for ( const DB of fs.readdirSync( path.join( __BaseDir, "mongodb" ) ) ) {
			const File = path.join( __BaseDir, "mongodb", DB );
			const Stats = fs.statSync( File );
			if ( Stats.isFile() ) {
				const DBImport = await import( File );
				if ( DBImport.Revalidate ) {
					SystemLib.Log( "Revalidate", `Schema for${ BC( "Cyan" ) }`, DB.toString().replace( ".ts", "" ) );
					await DBImport.Revalidate();
				}
			}
		}

		SystemLib.Log( "Start", "Create TRCP Server" );
		await import( "@server/trpc/server" );

		// Register Router and Frontend
		SystemLib.Log( "Start", "Register routings" );

		Api.get( "*", function( req, res ) {
			res.sendFile( path.join( __RootDir, "dist", "index.html" ) );
		} );

		// start the Discord Bot.
		SystemLib.Log( "Start", "Starting the bot" );
		const BotModul = await import( "@bot/index" );
		await BotModul.default();

		// Tasks
		SystemLib.Log( "Start", "Register all Tasks" );
		global.TaskManager = new TaskManagerClass();
		await TaskManager.Init();

		// Tasks
		HttpServer.listen( 80, async() =>
			SystemLib.Log( "start",
				"API listen on port", BC( "Cyan" ),
				80
			)
		);


	} );
