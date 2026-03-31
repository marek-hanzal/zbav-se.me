import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./e2e",
	globalSetup: "./e2e/init.ts",
	outputDir: "./results",
	webServer: [
		{
			name: "App",
			command: "bunx run-s e2e:build e2e:start",
			url: process.env.VITE_ORIGIN,
			ignoreHTTPSErrors: true,
			reuseExistingServer: false,
			timeout: 60_000,
			env: {
				SERVER_DATABASE_URL: "postgresql://postgres:postgres@localhost:55432/postgres",
			},
		},
	],
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
		ignoreHTTPSErrors: true,
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
