import ViteYaml from "@modyfi/vite-plugin-yaml";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { assetSizePlugin } from "@use-pico/vite-asset-size";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig(({ isSsrBuild, mode }) => {
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
			minify: "terser",
			sourcemap: false,
			rollupOptions: {
				treeshake: "smallest",
				output: {
					manualChunks(id) {
						// Vendor packages - check most specific first
						if (id.includes("node_modules/react/") && !id.includes("react-dom")) {
							return "react";
						}
						if (id.includes("react-dom")) {
							return "react-dom";
						}
						if (id.includes("zod")) {
							return "zod";
						}
						if (id.includes("js-sha256")) {
							return "js-sha256";
						}
						if (id.includes("sonner")) {
							return "sonner";
						}
						if (id.includes("better-auth")) {
							return "better-auth";
						}
						if (id.includes("axios")) {
							return "axios";
						}
						if (id.includes("@paralleldrive")) {
							return "paralleldrive";
						}
						if (id.includes("ts-pattern")) {
							return "ts-pattern";
						}
						if (id.includes("p-queue")) {
							return "p-queue";
						}
						if (id.includes("use-debounce")) {
							return "use-debounce";
						}
						// if (id.includes("effect")) {
						// 	return "effect";
						// }
						if (id.includes("luxon")) {
							return "luxon";
						}
						if (id.includes("@zbav-se.me/")) {
							return "zbav-se-me";
						}
						if (id.includes("@use-pico/")) {
							return "use-pico";
						}
						if (id.includes("@escapace")) {
							return "escapace";
						}
						if (
							id.includes("node_modules/") &&
							!id.includes("src/") &&
							!id.includes("tanstack/")
						) {
							return "vendor";
						}
					},
				},
			},
		},
	};
});
