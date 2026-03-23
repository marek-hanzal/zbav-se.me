import { defineConfig, devices } from "@playwright/test";

const appUrl = process.env.E2E_APP_URL ?? "http://zbav-se.me.localhost:1355";

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
		baseURL: appUrl,
		trace: "retain-on-failure",
		screenshot: "only-on-failure",
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
