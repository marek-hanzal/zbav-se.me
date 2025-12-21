import path from "node:path";
import ViteYaml from "@modyfi/vite-plugin-yaml";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { assetSizePlugin } from "@use-pico/vite-asset-size";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const Priority = {
	Core: 100,
	Leaf: 50,
	Lib: 30,
	Common: 10,
} as const;

const Bundle = {
	Stable: "stable",
} as const;

export default defineConfig(({ isSsrBuild, mode }) => {
	return {
		clearScreen: false,
		base: process.env.VITE_APP_ASSETS,
		resolve: {
			alias: {
				"~": path.resolve(__dirname, "./src"),
			},
		},
		plugins: [
			tanstackStart({
				router: {
					routesDirectory: "./@routes",
					generatedRouteTree: "./_route.ts",
				},
			}),
			react({}),
			tailwindcss(),
			ViteYaml(),
			assetSizePlugin({
				ssr: !!isSsrBuild,
			}),
			mode === "production"
				? nitro({
						preset: process.env.NITRO_PRESET || "vercel",
					})
				: undefined,
		],
		worker: {
			format: "es",
		},
		server: {
			host: true,
			strictPort: true,
			port: 3031,
			allowedHosts: true,
		},
		build: {
			target: "esnext",
			assetsDir: "assets",
			assetsInlineLimit: 0,
			sourcemap: false,
			rolldownOptions: {
				output: {
					advancedChunks: {
						minSize: 1_024 * 100,
						maxSize: 1_024 * 250,
						groups: [
							{
								name: "bundle",
							},
						],
					},
				},
			},
		},
	};
});
