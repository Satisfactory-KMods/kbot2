/** @type {import("vite").UserConfig} */

import {
	Alias,
	defineConfig
}              from "vite";
import react   from "@vitejs/plugin-react";
import eslint  from "vite-plugin-eslint";
import {
	join,
	resolve
}              from "path";
import * as fs from "fs";

const vendor = [ "react", "react-router-dom", "react-dom" ];
const flowbite = [ "flowbite", "flowbite-react" ];
const addons = [ "react-markdown", "emoji-picker-react", "react-select" ];
const icons = [ "react-icons" ];
const sweetalert = [ "sweetalert2", "sweetalert2-react-content" ];

function renderChunks( deps : Record<string, string> ) {
	const chunks : any = {};
	Object.keys( deps ).forEach( ( key ) => {
		if ( vendor.includes( key ) ) {
			return;
		}
		chunks[ key ] = [ key ];
	} );
	return chunks;
}

export default defineConfig( ( { command, mode, ssrBuild } ) => {
	const Paths : Record<string, string[]> = JSON.parse( fs.readFileSync( resolve( __dirname, "tsconfig.json" ), "utf-8" ).toString() ).compilerOptions.paths;
	const alias = Object.entries( Paths ).map<Alias>( ( [ key, value ] ) => ( {
		find: key.replace( "/*", "" ),
		replacement: join( __dirname, value[ 0 ].replace( "/*", "" ) )
	} ) );
	console.log( "Resolve Alias:", alias );
	return {
		envDir: process.cwd(),
		assetsInclude: [ "**/*.md" ],
		resolve: {
			alias
		},
		server: {
			port: 3000,
			watch: {
				usePolling: false
			},
			proxy: {
				"/api": {
					target: "http://127.0.0.1:80",
					changeOrigin: true,
					secure: false,
					ws: true
				}
			}
		},
		build: {
			manifest: true,
			sourcemap: false,
			outDir: "dist",
			rollupOptions: {
				output: {
					manualChunks: {
						vendor, flowbite, addons, icons, sweetalert
					}
				}
			}
		},
		plugins: [
			react( {
				include: "{**/*,*}.{js,ts,jsx,tsx}",
				babel: {
					parserOpts: {
						plugins: [ "decorators-legacy" ]
					}
				}
			} ), eslint( {
				include: "{**/*,*}.{js,ts,jsx,tsx}"
			} )
		]
	};
} );
