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
	vercel: {
		config: {
			crons: [
				{
					path: "/api/public/janitor/cleanup",
					schedule: "0 0 * * *",
				},
			],
		},
	},
	compatibilityDate: "latest",
	preset: "vercel",
	srcDir: "src",
	externals: {
		external: [
			"pg",
			"pg-native",
			"stripe",
			"minio",
			"@upstash/redis",
		],
	},
});
