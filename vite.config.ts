import { defineConfig } from "vite";
import react            from "@vitejs/plugin-react";
import eslint           from "vite-plugin-eslint";
import {
	isAbsolute,
	resolve
}                       from "path";

function isExternal( id : string ) {
	return !id.startsWith( "." ) && !isAbsolute( id );
}

export default defineConfig( {
	assetsInclude: [ "**/*.md" ],
	resolve: {
		alias: {
			"@app/*": resolve( __dirname, "src/*" ),
			"@hooks/*": resolve( __dirname, "src/hooks/*" ),
			"@comp/*": resolve( __dirname, "src/components/*" ),
			"@style/*": resolve( __dirname, "src/components/*" ),
			"@routing/*": resolve( __dirname, "src/routing/*" ),
			"@shared/*": resolve( __dirname, "shared/*" ),
			"@/*": resolve( __dirname, "./*" ),
			"@server/*": resolve( __dirname, "server/src/*" )
		}
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
		sourcemap: true,
		outDir: "dist",
		rollupOptions: {
			external: isExternal,
			input: {
				app: "./index.html"
			},
			output: {
				entryFileNames: assetInfo => {
					return assetInfo.name === "OneSignalSDKWorker" ? "[name].js" : "assets/js/[name].js";
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
} );
