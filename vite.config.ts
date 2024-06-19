import { defineConfig } from "vite"
import path from "path"

export default defineConfig( {
	server: {
		host: true,
	},
	resolve: {
		alias: {
			"@compute": path.resolve( __dirname, "./src/shaders/compute" ),
			"@vertex": path.resolve( __dirname, "./src/shaders/vertex" ),
			"@fragment": path.resolve( __dirname, "./src/shaders/fragment" ),
			"@render": path.resolve( __dirname, "./src/render" ),
			"@lib": path.resolve( __dirname, "./src/library" ),
		}
	}
} )
