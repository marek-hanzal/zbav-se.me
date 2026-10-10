import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	// Release builds receive explicit public settings, never local dotenv files.
	envDir: false,
	resolve: {
		alias: {
			"~": path.resolve(import.meta.dirname, "./src"),
		},
	},
	ssr: {
		noExternal: true,
	},
	build: {
		ssr: "src/database-migration/script/migrate.ts",
		target: "node24",
		minify: false,
		rolldownOptions: {
			checks: {
				moduleLevelDirective: false,
			},
			// Better Auth's cookie hook imports Start lazily; migrations never run it.
			external: [
				"pg-native",
				"@tanstack/react-start/server",
			],
			output: {
				entryFileNames: "migrate.mjs",
			},
		},
	},
});
