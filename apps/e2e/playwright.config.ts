import { defineConfig, devices } from "@playwright/test";

const reuseExistingServer = process.env.E2E_REUSE_EXISTING_SERVER === "1" || !process.env.CI;

export default defineConfig({
	testDir: "./test",
	globalSetup: "./init.ts",
	outputDir: "./results",
	webServer: [
		{
			name: "Frontend",
			command: "bun run --cwd ../app e2e",
			url: process.env.VITE_ORIGIN,
			reuseExistingServer,
			timeout: 60_000,
		},
		{
			name: "Backend",
			command: "bun run --cwd ../server e2e",
			url: `${process.env.VITE_SERVER_API}/api/public/health`,
			reuseExistingServer,
			timeout: 60_000,
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
