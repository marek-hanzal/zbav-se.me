import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./test",
	outputDir: "./test-results",
	reporter: process.env.CI
		? [
				[
					"list",
				],
				[
					"html",
					{
						open: "never",
					},
				],
			]
		: [
				[
					"list",
				],
			],
	use: {
		baseURL: process.env.VITE_ORIGIN,
		locale: "cs-CZ",
		trace: "retain-on-failure",
		screenshot: "on",
		video: "retain-on-failure",
	},
	projects: [
		{
			name: "iphone-se",
			use: {
				browserName: "chromium",
				...devices["iPhone SE"],
			},
		},
	],
});
