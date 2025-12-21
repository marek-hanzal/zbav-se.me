import path from "node:path";
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
					minify: false,
					advancedChunks: {
						groups: [
							{
								test: /node_modules\/react-dom/,
								name: "react-dom",
							},
							{
								test: /node_modules\/react/,
								name: "react",
							},
							{
								test: /node_modules\/tailwind-merge/,
								name: "tailwind-merge",
							},
							{
								test: /node_modules\/@tanstack\/query-core/,
								name: "tanstack-query-core",
							},
							{
								test: /node_modules\/@tanstack\/react-query/,
								name: "tanstack-react-query",
							},
							{
								test: /node_modules\/@tanstack\/query-persist-client-core/,
								name: "tanstack-query-persist-client-core",
							},
							{
								test: /node_modules\/@tanstack\/query-async-storage-persister/,
								name: "tanstack-query-async-storage-persister",
							},
							{
								test: /node_modules\/@tanstack\/react-form/,
								name: "tanstack-react-form",
							},
							{
								test: /node_modules\/@tanstack\/router-core/,
								name: "tanstack-router-core",
							},
							{
								test: /node_modules\/@tanstack\/react-router/,
								name: "tanstack-react-router",
							},
							{
								test: /node_modules\/zod/,
								name: "zod",
							},
							{
								test: /node_modules\/axios/,
								name: "axios",
							},
							{
								test: /node_modules\/@simplewebauthn/,
								name: "simplewebauthn",
							},
							{
								test: /node_modules\/better-auth/,
								name: "better-auth",
							},
							{
								test: /node_modules\/@better-auth\/passkey/,
								name: "better-auth-passkey",
							},
							{
								test: /node_modules\/sonner/,
								name: "sonner",
							},
							{
								test: /node_modules\/luxon/,
								name: "luxon",
							},
							{
								test: /node_modules\/@paralleldrive/,
								name: "paralleldrive",
							},
							{
								test: /node_modules\/ts-pattern/,
								name: "ts-pattern",
							},
							{
								test: /node_modules\/p-queue/,
								name: "p-queue",
							},
							{
								test: /node_modules\/use-debounce/,
								name: "use-debounce",
							},
							{
								test: /node_modules\/motion/,
								name: "motion",
							},
							{
								test: /node_modules\/gsap/,
								name: "gsap",
							},
							{
								test: /node_modules\/js-sha256/,
								name: "js-sha256",
							},
							{
								test: /packages\/@use-pico\/cls/,
								name: "use-pico-cls",
							},
							{
								test: /packages\/@use-pico/,
								name: "use-pico",
							},
							{
								test: /packages\/@zbav-se.me\/sdk/,
								name: "zbav-se-me-sdk",
							},
							{
								test: /packages\/@zbav-se.me/,
								name: "zbav-se-me",
							},
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
