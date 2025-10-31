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
    },
    ssr: {
      external: [
        '@zbav-se.me/sdk',
      ],
      noExternal: ["@tanstack/*",],
    },
    optimizeDeps: { noDiscovery: true, include: [] },
  } satisfies UserConfig;
  
  const clientConfig = {
    build: {
      minify: "esbuild",
    },
    optimizeDeps: {
      noDiscovery: true,
      include: ["react", "react-dom", "zod"],
    },
  } satisfies UserConfig;

export default defineConfig(({ isSsrBuild, mode }) => {
    const selected = isSsrBuild ? ssrConfig : clientConfig;

	return mergeConfig({
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
	}, selected);
});
