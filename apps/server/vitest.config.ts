import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	build: {
		target: "esnext",
		minify: false,
	},
	optimizeDeps: {
		include: [
			"vitest",
		],
	},
	cacheDir: "./node_modules/.vite",
	resolve: {
		alias: [
			{
				find: /^~\/test\//,
				replacement: `${resolve(__dirname, "./test")}/`,
			},
			{
				find: /^~\//,
				replacement: `${resolve(__dirname, "./src")}/`,
			},
		],
	},
	test: {
		globalSetup: [
			"./test/init.ts",
		],
		environment: "node",
		setupFiles: [
			"./test/setup.ts",
		],
		globals: true,
		include: [
			"test/**/*.test.ts",
		],
		passWithNoTests: true,
		isolate: false,
		sequence: {
			shuffle: false,
		},
		pool: "forks",
		maxConcurrency: 4,
		//
		maxWorkers: 8,
		//
		coverage: {
			enabled: false,
		},
		silent: false,
		ui: false,
	},
});
