import path from "node:path";
import { test as base, expect } from "@playwright/test";
import { testabase } from "./utils/testabase";

const appOrigin = process.env.VITE_ORIGIN ?? "https://zbav-se.me.localhost:1355";

function toDatabaseName(file: string, title: string, workerIndex: number, retry: number) {
	const fileName = path.basename(file, path.extname(file));
	const rawName = [
		fileName,
		title,
		`w${workerIndex}`,
		`r${retry}`,
	]
		.join("-")
		.toLowerCase()
		.replace(/[^a-z0-9_-]+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-+|-+$/g, "");

	return `e2e-${rawName || "test"}`.slice(0, 63);
}

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

export const test = base.extend<{
	appOrigin: string;
	db: string;
	database: TestDatabase;
}>({
	async appOrigin({}, use) {
		await use(appOrigin);
	},
	// biome-ignore lint/correctness/noEmptyPattern: Ssst
	async db({}, use, testInfo) {
		await use(
			toDatabaseName(testInfo.file, testInfo.title, testInfo.workerIndex, testInfo.retry),
		);
	},
	async database({ db }, use) {
		let cleanup = async () => {};

		const database = await testabase({
			name: db,
			onTestFinished(callbackFn) {
				cleanup = callbackFn;
			},
		});

		await use(database);

		await fetch(new URL("/api/e2e", appOrigin), {
			method: "DELETE",
			headers: {
				"x-e2e-db": db,
			},
		});

		await cleanup();
	},
	async page({ page, db }, use) {
		await page.context().route("**/*", async (route) => {
			const request = route.request();
			const headers = {
				...request.headers(),
			};
			const isAppRequest = new URL(request.url()).origin === appOrigin;

			if (isAppRequest) {
				headers["x-e2e-db"] = db;
			} else {
				delete headers["x-e2e-db"];
			}

			await route.continue({
				headers,
			});
		});

		await use(page);
	},
});

export { expect };
