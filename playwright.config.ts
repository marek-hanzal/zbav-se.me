import { defineConfig, devices } from "@playwright/test";

const appOrigin = process.env.VITE_ORIGIN ?? "https://zbav-se.me.localhost:1355";
const e2eWorkers = Number.parseInt(process.env.E2E_WORKERS ?? "4", 10);

export default defineConfig({
	testDir: "./e2e",
	globalSetup: "./e2e/init.ts",
	outputDir: "./results",
	workers: e2eWorkers,
	webServer: [
		{
			name: "App",
			command: "bunx run-s e2e:build e2e:start",
			url: new URL("/api/e2e", appOrigin).toString(),
			ignoreHTTPSErrors: true,
			reuseExistingServer: false,
			timeout: 60_000,
			env: {
				...process.env,
				SERVER_DATABASE_URL: "postgresql://postgres:postgres@localhost:55432/postgres",
				SERVER_E2E: "e2e",
			},
		},
	],
	failOnFlakyTests: true,
	fullyParallel: false,
	reporter: process.env.CI
		? [
				[
					"github",
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
		baseURL: appOrigin,
		ignoreHTTPSErrors: true,
		locale: "cs-CZ",
		trace: "retain-on-failure",
		screenshot: "on",
		video: "on",
	},
	projects: [
		{
			name: "mobile",
			use: {
				browserName: "chromium",
				headless: true,
				...devices["iPhone SE"],
			},
		},
		{
			name: "dev",
			use: {
				browserName: "chromium",
				headless: true,
				...devices["iPhone SE"],
			},
		},
	],
});
