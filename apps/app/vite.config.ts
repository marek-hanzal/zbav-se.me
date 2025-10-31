import ViteYaml from "@modyfi/vite-plugin-yaml";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, mergeConfig, type UserConfig } from "vite";
import dynamicImport from "vite-plugin-dynamic-import";
import { qrcode } from "vite-plugin-qrcode";
import wasm from "vite-plugin-wasm";
import paths from "vite-tsconfig-paths";

const ssrConfig = {
	build: {
		minify: false,
		sourcemap: false,
		rollupOptions: {
			treeshake: {
				moduleSideEffects: false,
			},
		},
	},
	ssr: {
		external: [
			"@zbav-se.me/sdk",
		],
		noExternal: [
			"@tanstack/*",
		],
	},
	optimizeDeps: {
		noDiscovery: true,
		include: [],
	},
} satisfies UserConfig;

const clientConfig = {
	worker: {
		format: "es",
		plugins: () => [
			paths(),
			wasm(),
		],
	},
	plugins: [
		qrcode(),
		tailwindcss(),
		react({}),
		wasm(),
		dynamicImport(),
	],
	esbuild: {
		drop: [
			"console",
			"debugger",
		],
	},
	build: {
		assetsInlineLimit: 0,
		minify: "esbuild",
		rollupOptions: {
			treeshake: {
				moduleSideEffects: false,
			},
			output: {
				manualChunks(id) {
					if (id.includes("react")) {
						return "react";
					}
					if (id.includes("@tanstack/")) {
						return "tanstack";
					}
					if (id.includes("zod")) {
						return "zod";
					}
					if (id.includes("@zbav-se.me/")) {
						return "zbav-se-me";
					}
					if (id.includes("@use-pico/")) {
						return "use-pico";
					}
					return "vendor";
				},
			},
		},
	},
	json: {
		stringify: true,
	},
	// optimizeDeps: {
	// 	// noDiscovery: true,
	// 	include: [
	// 		"react",
	// 		"react-dom",
	// 		"zod",
	// 	],
	// },
} satisfies UserConfig;

export default defineConfig(({ isSsrBuild, mode }) => {
	const selected = isSsrBuild ? ssrConfig : clientConfig;

	return mergeConfig(
		{
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
				ViteYaml(),
				mode === "production"
					? nitro({
							config: {
								preset: "vercel",
							},
						})
					: undefined,
			],
			server: {
				host: true,
				strictPort: true,
				port: 3031,
				allowedHosts: true,
			},
			build: {
				target: "esnext",
				assetsDir: "assets",
				sourcemap: false,
				manifest: false,
				rollupOptions: {
					treeshake: true,
				},
			},
		},
		selected,
	);
});
