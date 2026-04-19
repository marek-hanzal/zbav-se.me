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
			{
				find: /^@\/lib\//,
				replacement: `${resolve(__dirname, "./lib")}/`,
			},
		],
	},
	test: {
		globalSetup: [
			"./test/init.ts",
		],
		environment: "node",
		globals: true,
		include: [
			"./test/**/*.test.ts",
		],
		slowTestThreshold: 1_000,
		passWithNoTests: true,
		isolate: false,
		sequence: {
			shuffle: false,
		},
		benchmark: {
			compare: "benchmark.json",
			reporters: [
				"default",
			],
		},
		//
		/**
		 * Fuckin' GitHub Actions are too lazy...
		 */
		testTimeout: 10_000,
		//
		pool: "forks",
		maxConcurrency: 4,
		//
		maxWorkers: 8,
		//
		coverage: {
			enabled: true,
			provider: "v8",
			reporter: [
				"text-summary",
				"html",
				"lcov",
				"cobertura",
				"json-summary",
			],
			reportsDirectory: "./coverage/vitest",
			include: [
				"src/**/server/db/**/*Fx.ts",
				"src/**/server/fx/**/*Fx.ts",
				"src/server/database/fx/**/*Fx.ts",
			],
			exclude: [
				"**/*.test.ts",
				"**/*.d.ts",
				//
				"src/server/@migrations/**/*.ts",
				"src/server/@system/**/*.ts",
				"src/**/server/tool/**/*.ts",
			],
			reportOnFailure: false,
			watermarks: {
				statements: [
					45,
					75,
				],
				branches: [
					35,
					65,
				],
				functions: [
					45,
					75,
				],
				lines: [
					45,
					75,
				],
			},
		},
		bail: 1,
		silent: false,
		ui: false,
	},
});
