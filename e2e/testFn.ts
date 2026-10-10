import { createHash } from "node:crypto";
import path from "node:path";
import type { APIRequestContext } from "@playwright/test";
import { test as base, expect } from "@playwright/test";
import { testabaseFn } from "./utils/testabaseFn";

const appOrigin = process.env.VITE_ORIGIN ?? "https://zbav-se.me.localhost:1355";
const DATABASE_NAME_LIMIT = 63;
const DATABASE_NAME_HASH_LENGTH = 8;

function toDatabaseHashFn(value: string) {
	return createHash("sha256").update(value).digest("hex").slice(0, DATABASE_NAME_HASH_LENGTH);
}

function toDatabaseNameFn(
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

	const suffix = toDatabaseHashFn(rawName);
	const prefixLimit = DATABASE_NAME_LIMIT - suffix.length - 1;
	const prefix = `e2e-${rawName || "test"}`.slice(0, prefixLimit).replace(/-+$/g, "");

	return `${prefix}-${suffix}`;
}

type TestDatabase = Awaited<ReturnType<typeof testabaseFn>>;

type WithRequest = <T>(callbackFn: (request: APIRequestContext) => Promise<T>) => Promise<T>;

interface TestOptions {
	dbName?: string;
}

interface TestFixtures {
	appOrigin: string;
	db: string;
	database: TestDatabase;
	withRequestFn: WithRequest;
}

type TestArgs = TestOptions & TestFixtures;

export const testFn = base.extend<TestArgs>({
	dbName: [
		undefined as string | undefined,
		{
			option: true,
		},
	],
	// biome-ignore lint/correctness/noEmptyPattern: Ssst
	async appOrigin({}, useFn) {
		await useFn(appOrigin);
	},
	async db({ dbName }, useFn, testInfo) {
		await useFn(
			dbName ??
				toDatabaseNameFn(
					testInfo.file,
					testInfo.project.name,
					testInfo.title,
					testInfo.workerIndex,
					testInfo.retry,
				),
		);
	},
	async database({ db }, useFn) {
		let cleanupFn = async () => {};

		const database = await testabaseFn({
			name: db,
			onTestFinishedFn(callbackFn) {
				cleanupFn = callbackFn;
			},
		});

		await useFn(database);

		await fetch(new URL("/api/e2e", appOrigin), {
			method: "DELETE",
			headers: {
				"x-e2e-db": db,
			},
		});

		await cleanupFn();
	},
	async withRequestFn({ appOrigin, db, playwright }, useFn) {
		const contexts = new Set<APIRequestContext>();

		const withRequestFn: WithRequest = async (callbackFn) => {
			const context = await playwright.request.newContext({
				baseURL: appOrigin,
				extraHTTPHeaders: {
					origin: appOrigin,
					"x-e2e-db": db,
					// Match the local proxy's client IP instead of the seed's unknown source.
					"x-forwarded-for": "127.0.0.1",
				},
				ignoreHTTPSErrors: true,
			});

			contexts.add(context);

			try {
				return await callbackFn(context);
			} finally {
				contexts.delete(context);
				await context.dispose();
			}
		};

		await useFn(withRequestFn);

		await Promise.all(
			Array.from(contexts).map(async (context) => {
				await context.dispose();
			}),
		);
	},
	async page({ page, db, database }, useFn) {
		void database;

		await page.context().route("**/*", async (route) => {
			const request = route.request();
			const isAppRequest = new URL(request.url()).origin === appOrigin;

			if (!isAppRequest) {
				await route.continue();
				return;
			}

			await route.continue({
				headers: {
					...request.headers(),
					"x-e2e-db": db,
				},
			});
		});

		try {
			await useFn(page);
		} finally {
			if (!page.isClosed()) {
				await page.close();
			}
		}
	},
});

export { expect };
