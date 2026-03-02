import type { KnipConfig } from "knip";

const config: KnipConfig = {
	$schema: "https://unpkg.com/knip@5/schema.json",
	entry: [
		"src/**/index.ts",
		"rollup.config.mjs",
	],
	project: [
		"src/**/*.{ts,tsx}",
		"rollup.config.mjs",
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
