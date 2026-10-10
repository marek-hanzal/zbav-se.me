import path from "node:path";
import ViteYaml from "@modyfi/vite-plugin-yaml";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
	const isProduction = mode === "production";

	return {
		clearScreen: false,
		envDir: process.env.ZBAV_SE_ME_RELEASE === "1" ? false : undefined,
		base: process.env.VITE_APP_ASSETS,
		resolve: {
			alias: {
				"~": path.resolve(import.meta.dirname, "./src"),
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
			isProduction
				? nitro({
						preset: process.env.NITRO_PRESET || "vercel",
						noExternals: true,
						rolldownConfig: {
							checks: {
								moduleLevelDirective: false,
							},
						},
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
				// Suppress noisy dependency `use client` directive diagnostics.
				checks: {
					moduleLevelDirective: false,
				},
				output: {
					minify: false,
				},
			},
		},
	};
});
