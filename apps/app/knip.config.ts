import type { KnipConfig } from "knip";

const config: KnipConfig = {
	$schema: "https://unpkg.com/knip@5/schema.json",
	entry: [
		"src/_route.ts",
		"src/@routes/**/*.{ts,tsx}",
		"cli/**/*.ts",
	],
	project: [
		"src/**/*.{ts,tsx}",
	],
	ignore: [
		"**/node_modules/**",
		"**/dist/**",
		"**/build/**",
		"**/.output/**",
	],
	ignoreDependencies: [
		"@iconify/json",
		"@iconify/tailwind4",
		"@tanstack/router-plugin",
		"@use-pico/client",
		"@use-pico/cls",
		"@use-pico/common",
		"@use-pico/server",
		"@zbav-se.me/sdk",
		"@zbav-se.me/server",
		"@zbav-se.me/ui",
		"npm-run-all2",
		"tailwindcss",
	],
};

export default config;
