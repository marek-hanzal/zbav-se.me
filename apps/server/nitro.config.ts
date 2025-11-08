import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
	esbuild: {
		options: {
			target: "node22",
		},
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
