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
		base: process.env.VITE_APP_ASSETS,
		plugins: [
			tanstackStart({
				router: {
					routesDirectory: "./@routes",
					generatedRouteTree: "./_route.ts",
				},
			}),
			paths(),
			qrcode(),
			tailwindcss(),
			react({}),
			wasm(),
			dynamicImport(),
			ViteYaml(),
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
			strictPort: true,
			port: 3031,
			allowedHosts: true,
		},
		build: {
			target: "esnext",
			assetsDir: "assets",
			assetsInlineLimit: 0,
			minify: "esbuild",
			sourcemap: false,
			manifest: false,
			// rollupOptions: {
			// 	treeshake: true,
			// 	output: {
			// 		manualChunks(id) {
			// 			if (id.includes("react")) {
			// 				return "react";
			// 			}
			// 			if (id.includes("@tanstack/")) {
			// 				return "tanstack";
			// 			}
			// 			if (id.includes("zod")) {
			// 				return "zod";
			// 			}
			// 			if (id.includes("@zbav-se.me/")) {
			// 				return "zbav-se-me";
			// 			}
			// 			if (id.includes("@use-pico/")) {
			// 				return "use-pico";
			// 			}
			// 			return "vendor";
			// 		},
			// 	},
			// },
		},
		json: {
			stringify: true,
		},
	};
});
