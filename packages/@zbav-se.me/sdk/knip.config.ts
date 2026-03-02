import type { KnipConfig } from "knip";

const config: KnipConfig = {
	$schema: "https://unpkg.com/knip@5/schema.json",
	entry: [
		"src/api/**/index.ts",
		"src/query/**/index.ts",
		"src/mutation/**/index.ts",
		"openapi-ts.config.ts",
	],
	project: [
		"src/**/*.{ts,tsx}",
		"openapi-ts.config.ts",
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
