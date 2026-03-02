import type { KnipConfig } from "knip";

const config: KnipConfig = {
	$schema: "https://unpkg.com/knip@5/schema.json",
	entry: [
		"src/**/index.ts",
		"src/ui.css",
	],
	project: [
		"src/**/*.{ts,tsx,css}",
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
