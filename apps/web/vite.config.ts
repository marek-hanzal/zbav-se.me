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
};

export default defineConfig(({ isSsrBuild, mode }) => {
	return {
		clearScreen: false,
		base: process.env.VITE_WEB_ASSETS,
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
			port: 3030,
			allowedHosts: true,
		},
		rolldownOptions: {
			output: {
				advancedChunks: {
					groups: [
						{
							test: /node_modules\/react\//,
							name: "react",
							priority: Priority.Core,
						},
						{
							test: /node_modules\/react-dom\//,
							name: "react-dom",
							priority: Priority.Core,
						},
						{
							test: /node_modules\/tailwind-merge/,
							name: "tailwind-merge",
							priority: Priority.Leaf,
						},
						{
							test: /node_modules\/@tanstack\/query-core/,
							name: "tanstack-query-core",
							priority: 10,
						},
						{
							test: /node_modules\/@tanstack\/react-query/,
							name: "tanstack-react-query",
							priority: 5,
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
							priority: 5,
						},
						{
							test: /node_modules\/@tanstack\/router-core/,
							name: "tanstack-router-core",
							priority: 10,
						},
						{
							test: /node_modules\/@tanstack\/react-router/,
							name: "tanstack-react-router",
							priority: 5,
						},
						{
							test: /node_modules\/zod/,
							name: "zod",
							priority: Priority.Leaf,
						},
						{
							test: /node_modules\/axios/,
							name: "axios",
							priority: Priority.Leaf,
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
							priority: Priority.Lib,
						},
						{
							test: /node_modules\/luxon/,
							name: "luxon",
							priority: Priority.Leaf,
						},
						{
							test: /node_modules\/@paralleldrive/,
							name: "paralleldrive",
							priority: Priority.Leaf,
						},
						{
							test: /node_modules\/ts-pattern/,
							name: "ts-pattern",
							priority: Priority.Leaf,
						},
						{
							test: /node_modules\/p-queue/,
							name: "p-queue",
							priority: Priority.Leaf,
						},
						{
							test: /node_modules\/use-debounce/,
							name: "use-debounce",
							priority: Priority.Lib,
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
							priority: Priority.Leaf,
						},
						{
							test: /node_modules\/react-markdown/,
							name: "react-markdown",
							priority: Priority.Lib,
						},
						{
							test: /node_modules\/remark-gfm/,
							name: "remark-gfm",
							priority: Priority.Lib,
						},
						{
							test: /node_modules\/zustand/,
							name: "zustand",
							priority: Priority.Lib,
						},
						{
							test: /node_modules\/@floating-ui\/react/,
							name: "floating-ui-react",
							priority: Priority.Lib,
						},
						{
							test: /node_modules\/react-dropzone/,
							name: "react-dropzone",
							priority: Priority.Lib,
						},
						{
							test: /node_modules\/lexical/,
							name: "lexical",
							priority: Priority.Lib,
						},
						{
							test: /node_modules\/kysely/,
							name: "kysely",
							priority: Priority.Leaf,
						},
						{
							test: /node_modules\/react-modal-sheet/,
							name: "react-modal-sheet",
							priority: Priority.Lib,
						},
						{
							test: /packages\/@use-pico\/cls/,
							name: "use-pico-cls",
							priority: Priority.Lib,
						},
						{
							test: /packages\/@use-pico/,
							name: "use-pico",
							priority: 5,
						},
						{
							test: /packages\/@zbav-se.me\/sdk/,
							name: "zbav-se-me-sdk",
							priority: 5,
						},
						{
							test: /packages\/@zbav-se.me/,
							name: "zbav-se-me",
							priority: 5,
						},
					],
				},
			},
		},
	};
});
