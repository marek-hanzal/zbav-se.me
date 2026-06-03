import { createHash } from "node:crypto";
import path from "node:path";
import type { APIRequestContext } from "@playwright/test";
import { test as base, expect } from "@playwright/test";
import { testabase } from "./utils/testabase";

const appOrigin = process.env.VITE_ORIGIN ?? "https://zbav-se.me.localhost:1355";
const DATABASE_NAME_LIMIT = 63;
const DATABASE_NAME_HASH_LENGTH = 8;
const STRIPE_E2E_DATABASE_NAME = "e2e-stripe-billing";

function toDatabaseHash(value: string) {
	return createHash("sha256").update(value).digest("hex").slice(0, DATABASE_NAME_HASH_LENGTH);
}

function toDatabaseName(
	file: string,
	projectName: string,
	title: string,
	workerIndex: number,
	retry: number,
) {
	const fileName = path.basename(file, path.extname(file));
	const rawName = [
		projectName,
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

	const suffix = toDatabaseHash(rawName);
	const prefixLimit = DATABASE_NAME_LIMIT - suffix.length - 1;
	const prefix = `e2e-${rawName || "test"}`.slice(0, prefixLimit).replace(/-+$/g, "");

	return `${prefix}-${suffix}`;
}

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

type WithRequest = <T>(callback: (request: APIRequestContext) => Promise<T>) => Promise<T>;

export const test = base.extend<{
	appOrigin: string;
	db: string;
	database: TestDatabase;
	withRequest: WithRequest;
}>({
	// biome-ignore lint/correctness/noEmptyPattern: Ssst
	async appOrigin({}, use) {
		await use(appOrigin);
	},
	// biome-ignore lint/correctness/noEmptyPattern: Ssst
	async db({}, use, testInfo) {
		/**
		 * TODO: Use more reliable way to get the database name, ideally the test itself will send optionally the name or keep it generated
		 */
		const isStripeBillingTest = testInfo.file.endsWith(
			"e2e/billing/billing-stripe-checkout.test.ts",
		);

		await use(
			isStripeBillingTest
				? STRIPE_E2E_DATABASE_NAME
				: toDatabaseName(
						testInfo.file,
						testInfo.project.name,
						testInfo.title,
						testInfo.workerIndex,
						testInfo.retry,
					),
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
	async withRequest({ appOrigin, db, playwright }, use) {
		const contexts = new Set<APIRequestContext>();

		const withRequest: WithRequest = async (callback) => {
			const context = await playwright.request.newContext({
				baseURL: appOrigin,
				extraHTTPHeaders: {
					origin: appOrigin,
					"x-e2e-db": db,
				},
				ignoreHTTPSErrors: true,
			});

			contexts.add(context);

			try {
				return await callback(context);
			} finally {
				contexts.delete(context);
				await context.dispose();
			}
		};

		await use(withRequest);

		await Promise.all(
			Array.from(contexts).map(async (context) => {
				await context.dispose();
			}),
		);
	},
	async page({ page, db, database }, use) {
		void database;

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

		try {
			await use(page);
		} finally {
			if (!page.isClosed()) {
				await page.close();
			}
		}
	},
});

export { expect };
