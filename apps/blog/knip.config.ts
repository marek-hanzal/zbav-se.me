import type { KnipConfig } from "knip";

const config: KnipConfig = {
	$schema: "https://unpkg.com/knip@5/schema.json",
	entry: [
		"docusaurus.config.ts",
		"src/**/*.{ts,tsx,js,jsx}",
	],
	project: [
		"docusaurus.config.ts",
		"src/**/*.{ts,tsx,js,jsx}",
		"tailwind.config.ts",
		"postcss.config.js",
	],
	ignore: [
		"**/node_modules/**",
		"**/dist/**",
		"**/build/**",
		"**/.output/**",
	],
	ignoreDependencies: [
		"@typescript/native-preview",
	],
};

export default config;
