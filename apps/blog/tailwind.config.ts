import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/**/*.{js,jsx,ts,tsx,md,mdx}",
		"./blog/**/*.{md,mdx}",
		"./docusaurus.config.ts",
	],
};
export default config;
