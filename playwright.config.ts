import { defineConfig, devices } from "@playwright/test";

const appOrigin = process.env.VITE_ORIGIN ?? "https://zbav-se.me.localhost:1355";
const e2eWorkers = Number(process.env.E2E_WORKERS ?? "8");
if (!Number.isInteger(e2eWorkers) || e2eWorkers < 1) {
	throw new Error("E2E_WORKERS must be a positive integer");
}

export default defineConfig({
	testDir: "./e2e",
	outputDir: "./results",
	timeout: 60_000,
	workers: e2eWorkers,
	webServer: [
		{
			name: "App",
			command: "bash cli/e2e-server.sh",
			url: new URL("/api/e2e", appOrigin).toString(),
			ignoreHTTPSErrors: true,
			reuseExistingServer: false,
			timeout: 60_000,
			env: {
				...process.env,
				SERVER_E2E: "e2e",
			},
		},
	],
	failOnFlakyTests: true,
	forbidOnly: Boolean(process.env.CI),
	fullyParallel: true,
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
				[
					"json",
					{
						outputFile: "./results/report.json",
					},
				],
			]
		: [
				[
					"list",
				],
				[
					"json",
					{
						outputFile: "./results/report.json",
					},
				],
			],
	use: {
		baseURL: appOrigin,
		ignoreHTTPSErrors: true,
		locale: "cs-CZ",
		serviceWorkers: "block",
		trace: "retain-on-failure",
		screenshot: "only-on-failure",
		video: "retain-on-failure",
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
	],
});
