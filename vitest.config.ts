import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defaultExclude, defineConfig } from "vitest/config";

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
	plugins: [
		react({}),
	],
	resolve: {
		alias: [
			{
				find: /^~\/test\//,
				replacement: `${resolve(import.meta.dirname, "./test")}/`,
			},
			{
				find: /^~\//,
				replacement: `${resolve(import.meta.dirname, "./src")}/`,
			},
		],
	},
	test: {
		environment: "node",
		globals: true,
		projects: [
			{
				test: {
					name: "unit",
					include: [
						"./test/**/*.unit.test.ts",
					],
				},
			},
			{
				test: {
					name: "integration",
					include: [
						"./test/**/*.test.ts",
					],
					exclude: [
						...defaultExclude,
						"**/*.unit.test.ts",
						"**/*.external.test.ts",
					],
					globalSetup: [
						"./test/init.ts",
					],
				},
			},
			{
				test: {
					name: "external",
					include: [
						"./test/**/*.external.test.ts",
					],
				},
			},
		],
		chaiConfig: {
			truncateThreshold: 0,
		},
		diff: {
			expand: true,
			truncateThreshold: 0,
			maxDepth: 12,
		},
		slowTestThreshold: 1_000,
		passWithNoTests: false,
		isolate: true,
		restoreMocks: true,
		unstubGlobals: true,
		unstubEnvs: true,
		sequence: {
			shuffle: false,
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
				"src/{buyer-*,seller-*,user-*,public-*,session-*}/{db,fx}/*Fx.ts",
				"src/{listing-attr,resource-definition,s3,translation,database,listing-spotlight,rate-limit,translator}/{db,fx}/*Fx.ts",
			],
			exclude: [
				"**/*.test.ts",
				"**/*.d.ts",
				//
				"src/database-migration/**/*.ts",
				"src/system-migration/**/*.ts",
				"src/*/tool/**/*.ts",
				"src/database/fx/databaseFx.ts",
			],
			reportOnFailure: true,
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
		silent: false,
		ui: false,
	},
});
