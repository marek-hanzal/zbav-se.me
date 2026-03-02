import type { KnipConfig } from "knip";

const config: KnipConfig = {
	$schema: "https://unpkg.com/knip@5/schema.json",
	entry: [
		"src/server.ts",
		"src/index.ts",
		"src/jwt/*.ts",
		"cli/**/*.ts",
		"nitro.config.ts",
		"vitest.config.ts",
	],
	project: [
		"src/**/*.{ts,tsx}",
		"test/**/*.{ts,tsx}",
		"cli/**/*.ts",
		"nitro.config.ts",
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
		"@use-pico/common",
		"jose",
	],
};

export default config;
