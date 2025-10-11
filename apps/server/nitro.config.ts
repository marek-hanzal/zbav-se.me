import { defineNitroConfig } from "nitropack/config";
import esbuild from "rollup-plugin-esbuild";

export default defineNitroConfig({
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
	replace: {
		__ORIGIN__: JSON.stringify(process.env.ORIGIN),
	},
});
