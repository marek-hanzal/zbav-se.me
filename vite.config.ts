import path from "node:path";
import ViteYaml from "@modyfi/vite-plugin-yaml";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const external = [
	"pg",
];

const noExternal = [
	"react",
	"react-dom",
	"server-only",
];

export default defineConfig(({ mode }) => {
	const isProduction = mode === "production";

	return {
		clearScreen: false,
		base: process.env.VITE_APP_ASSETS,
		resolve: {
			alias: {
				"~": path.resolve(__dirname, "./src"),
				"@/lib": path.resolve(__dirname, "./lib"),
			},
		},
		ssr: {
			external,
			noExternal,
		},
		plugins: [
			tanstackStart({
				router: {
					routesDirectory: "./@routes",
					generatedRouteTree: "./_route.ts",
				},
				rsc: {
					enabled: true,
				},
			}),
			rsc(),
			react({}),
			tailwindcss(),
			ViteYaml(),
			isProduction
				? nitro({
						preset: process.env.NITRO_PRESET || "vercel",
						noExternals: true,
					})
				: undefined,
		],
		worker: {
			format: "es",
		},
		server: {
			host: true,
			allowedHosts: true,
		},
		build: {
			target: "esnext",
			assetsDir: "assets",
			assetsInlineLimit: 0,
			sourcemap: false,
			rolldownOptions: {
				output: {
					minify: false,
				},
			},
		},
	};
});
