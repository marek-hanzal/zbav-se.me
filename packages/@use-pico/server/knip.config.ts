import type { KnipConfig } from "knip";

const config: KnipConfig = {
	$schema: "https://unpkg.com/knip@5/schema.json",
	entry: [
		"src/**/index.ts",
		"rollup.config.mjs",
		"vitest.config.ts",
		"test/**/*.test.ts",
		"test/**/src/**/*.{ts,tsx}",
	],
	project: [
		"src/**/*.{ts,tsx}",
		"test/**/*.{ts,tsx}",
		"test/**/src/**/*.{ts,tsx}",
		"rollup.config.mjs",
		"vitest.config.ts",
	],
	ignore: [
		"**/node_modules/**",
		"**/dist/**",
		"**/build/**",
		"**/.output/**",
	],
	ignoreDependencies: [
		"@typescript/native-preview",
		"@use-pico/*",
	],
};

export default config;
