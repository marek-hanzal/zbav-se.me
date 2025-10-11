import { defineNitroConfig } from "nitropack/config";
import esbuild from "rollup-plugin-esbuild";

export default defineNitroConfig({
	externals: {
		inline: [
			// "@use-pico/common",
		],
	},
	rollupConfig: {
		plugins: [
			esbuild({
				exclude: [],
				include: [
					/\.([cm]?ts)$/,
				],
				target: "es2022",
				tsconfig: "tsconfig.json",
			}),
		],
	},
	compatibilityDate: "latest",
	preset: "vercel",
	srcDir: "src",
});
