import ViteYaml from "@modyfi/vite-plugin-yaml";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import dynamicImport from "vite-plugin-dynamic-import";
import { qrcode } from "vite-plugin-qrcode";
import wasm from "vite-plugin-wasm";
import paths from "vite-tsconfig-paths";
import { locales } from "./src/locales";
import { prerender } from "./src/prerender";

export default defineConfig({
	clearScreen: false,
	base: process.env.VITE_ASSET_BASE,
	plugins: [
		tanstackStart({
			prerender: {
				enabled: true,
				concurrency: 8,
				crawlLinks: false,
			},
			pages: locales.flatMap((locale) =>
				prerender.map((path) => ({
					path: path.replace(":locale", locale),
					prerender: {
						crawlLinks: false,
					},
				})),
			),
			router: {
				routesDirectory: "./@routes",
				generatedRouteTree: "./_route.ts",
			},
			sitemap: {
				host: process.env.ORIGIN,
			},
		}),
		paths(),
		react({}),
		ViteYaml(),
		dynamicImport(),
		wasm(),
		qrcode(),
		tailwindcss(),
		nitro({
			config: {
				preset: "vercel",
			},
		}),
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
		assetsDir: "assets",
		sourcemap: true,
		manifest: true,
	},
});
