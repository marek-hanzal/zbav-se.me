import type { KnipConfig } from "knip";

const config: KnipConfig = {
	$schema: "https://unpkg.com/knip@5/schema.json",
	entry: [
		"src/_route.ts",
		"src/@routes/**/*.{ts,tsx}",
		"cli/**/*.ts",
		"test/**/*.ts",
		"e2e/**/*.ts",
		"vite.config.ts",
		"tailwind.config.ts",
	],
	project: [
		"cli/**/*.ts",
		"lib/**/*.{ts,tsx}",
		"src/**/*.{ts,tsx}",
		"test/**/*.{ts,tsx}",
		"e2e/**/*.{ts,tsx}",
		"vite.config.ts",
		"tailwind.config.ts",
	],
	ignoreDependencies: [
		"@iconify/json",
		"@iconify/tailwind4",
		"@tanstack/router-plugin",
		"@vitejs/plugin-rsc",
		"tailwindcss",
	],
};

export default config;
