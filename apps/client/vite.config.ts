import ViteYaml from "@modyfi/vite-plugin-yaml";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dynamicImport from "vite-plugin-dynamic-import";
import { qrcode } from "vite-plugin-qrcode";
import tla from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";
import paths from "vite-tsconfig-paths";

export default defineConfig({
	clearScreen: false,
	base: process.env.VITE_ASSET_BASE,
	plugins: [
		tanstackStart({
			prerender: {
				enabled: true,
				concurrency: 8,
			},
			router: {
				routesDirectory: "./@routes",
				generatedRouteTree: "./_route.ts",
			},
			sitemap: {
				host: process.env.ORIGIN,
			},
		}),
		tla(),
		paths(),
		react({}),
		ViteYaml(),
		dynamicImport(),
		wasm(),
		qrcode(),
		tailwindcss(),
	],
	worker: {
		format: "es",
		plugins: () => [
			paths(),
			wasm(),
		],
	},
	server: {
		host: true,
		strictPort: true,
		port: 4088,
		proxy: {
			"/api": {
				target: "http://localhost:4089",
				changeOrigin: true,
			},
		},
	},
	build: {
		target: "esnext",
		assetsDir: "assets", // keep a clean /assets namespace for CDN
		sourcemap: true, // helpful in prod debugging; optional
		manifest: true, // allows tooling to inspect built files; optional
	},
});
