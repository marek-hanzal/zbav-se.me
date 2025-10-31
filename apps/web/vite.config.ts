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

export default defineConfig(({ mode }) => {
	return {
		clearScreen: false,
		base: process.env.VITE_WEB_ASSETS,
		plugins: [
			tanstackStart({
				router: {
					routesDirectory: "./@routes",
					generatedRouteTree: "./_route.ts",
				},
				// sitemap: {
				// 	host: process.env.VITE_WEB_ORIGIN,
				// },
			}),
			paths(),
			react({}),
			ViteYaml(),
			dynamicImport(),
			wasm(),
			qrcode(),
			tailwindcss(),
			mode === "production"
				? nitro({
						config: {
							preset: "vercel",
						},
					})
				: undefined,
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
			port: 3030,
			strictPort: true,
			allowedHosts: true,
		},
		build: {
			target: "esnext",
			assetsDir: "assets",
			sourcemap: true,
			manifest: true,
		},
	};
});
