import { createHash } from "node:crypto";
import path from "node:path";
import type { APIRequestContext } from "@playwright/test";
import { test as base, expect } from "@playwright/test";
import { TEST_USER_PASSWORD } from "~/test/user/fx/leaseTestUserFx";
import { cleanupDatabaseFn } from "./utils/cleanupDatabaseFn";
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

interface SignInUser {
	email: string;
	password?: string;
}

type SignIn = (user: SignInUser) => Promise<void>;

interface TestOptions {
	dbName?: string;
}

interface TestFixtures {
	appOrigin: string;
	db: string;
	database: TestDatabase;
	withRequestFn: WithRequest;
	signInFn: SignIn;
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
	async db({ database }, useFn) {
		await useFn(database.databaseName);
	},
	async database({ appOrigin, dbName, playwright }, useFn, testInfo) {
		if (process.env.ZBAV_E2E_RUN !== "1") {
			throw new Error("Run E2E through argc e2e to allocate an isolated database");
		}
		let cleanupFn = async () => {};

		const database = await testabaseFn({
			name:
				dbName ??
				toDatabaseNameFn(
					testInfo.file,
					testInfo.project.name,
					testInfo.title,
					testInfo.workerIndex,
					testInfo.retry,
				),
			onTestFinishedFn(callbackFn) {
				cleanupFn = callbackFn;
			},
		});

		const closePoolFn = async () => {
			const request = await playwright.request.newContext({
				baseURL: appOrigin,
				ignoreHTTPSErrors: true,
				timeout: 5_000,
			});

			try {
				const response = await request.delete("/api/e2e", {
					headers: {
						"x-e2e-db": database.databaseName,
					},
				});

				if (!response.ok()) {
					throw new Error(
						`Application database pool cleanup failed (${response.status()})`,
					);
				}
			} finally {
				await request.dispose();
			}
		};

		try {
			await useFn(database);
		} finally {
			await cleanupDatabaseFn({
				databaseName: database.databaseName,
				closePoolFn,
				cleanupFn,
			});
		}
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
				timeout: 10_000,
			});

			contexts.add(context);

			try {
				return await callbackFn(context);
			} finally {
				contexts.delete(context);
				await context.dispose();
			}
		};

		try {
			await useFn(withRequestFn);
		} finally {
			await Promise.all(
				Array.from(contexts).map(async (context) => {
					await context.dispose();
				}),
			);
		}
	},
	async signInFn({ appOrigin, context, db }, useFn) {
		await useFn(async ({ email, password = TEST_USER_PASSWORD }) => {
			await testFn.step("Sign in through the real auth API", async () => {
				// This request context shares cookies with the browser. Browser routing
				// does not intercept API requests, so pass the database explicitly.
				const response = await context.request.post("/api/auth/sign-in/email", {
					headers: {
						origin: appOrigin,
						"x-e2e-db": db,
						"x-forwarded-for": "127.0.0.1",
					},
					data: {
						email,
						password,
					},
					timeout: 10_000,
				});
				try {
					await expect(response).toBeOK();
				} finally {
					await response.dispose();
				}
			});
		});
	},
	// Allocate the DB before the inherited context so its teardown runs last.
	async context({ appOrigin, db, context }, useFn) {
		const isAppUrlFn = (url: URL) => url.origin === new URL(appOrigin).origin;

		await context.route(isAppUrlFn, async (route) => {
			const request = route.request();

			await route.continue({
				headers: {
					...request.headers(),
					"x-e2e-db": db,
				},
			});
		});

		try {
			await useFn(context);
		} finally {
			// Close every page before evicting the server pool or dropping the clone.
			await context.close();
		}
	},
});

export { expect };
