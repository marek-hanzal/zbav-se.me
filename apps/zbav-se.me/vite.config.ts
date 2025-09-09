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
	plugins: [
		tanstackStart({
			spa: {
				enabled: true,
			},
			customViteReactPlugin: true,
			tsr: {
				generatedRouteTree: "./src/_route.ts",
				routesDirectory: "./src/@routes",
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
		strictPort: true,
		port: 4088,
	},
	build: {
		target: "esnext",
	},
	optimizeDeps: {
		exclude: [
			"pg",
		],
	},
});
