import ViteYaml from "@modyfi/vite-plugin-yaml";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dynamicImport from "vite-plugin-dynamic-import";
import tla from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";
import paths from "vite-tsconfig-paths";
import { qrcode } from "vite-plugin-qrcode";
import webfontDownload from "vite-plugin-webfont-dl";

export default defineConfig({
	clearScreen: false,
	plugins: [
		tanstackStart({
			customViteReactPlugin: true,
		}),
		tla(),
		paths(),
		react({}),
		ViteYaml(),
		dynamicImport(),
		wasm(),
		qrcode(),
		webfontDownload(),
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
		// headers: {
		// 	"Cross-Origin-Opener-Policy": "same-origin",
		// 	"Cross-Origin-Embedder-Policy": "require-corp",
		// },
	},
	build: {
		target: "esnext",
	},
	optimizeDeps: {
		exclude: [
			"sqlocal",
		],
	},
});
