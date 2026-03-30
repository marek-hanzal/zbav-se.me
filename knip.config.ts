import type { KnipConfig } from "knip";

const config: KnipConfig = {
	$schema: "https://unpkg.com/knip@5/schema.json",
	entry: [
		"src/_route.ts",
		"src/@routes/**/*.{ts,tsx}",
		"cli/**/*.ts",
		"vite.config.ts",
		"tailwind.config.ts",
	],
	project: [
		"src/**/*.{ts,tsx}",
		"cli/**/*.ts",
		"vite.config.ts",
		"tailwind.config.ts",
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
		"@zbav-se.me/*",
		"@iconify/json",
		"@iconify/tailwind4",
		"@tanstack/router-plugin",
		"tailwindcss",
	],
};

export default config;
