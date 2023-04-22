import { defineConfig } from "vite";
import vue              from "@vitejs/plugin-vue";
import vueJsx           from "@vitejs/plugin-vue-jsx";
import eslint           from "vite-plugin-eslint";
import * as path        from "path";

// https://vitejs.dev/config/
export default defineConfig( {
	resolve: {
		alias: {
			"@app": path.resolve( __dirname, "src" ),
			"@shared": path.resolve( __dirname, "shared" )
		}
	},
	server: {
		port: 3000
	},
	plugins: [ vue(), eslint(), vueJsx() ]
} );
