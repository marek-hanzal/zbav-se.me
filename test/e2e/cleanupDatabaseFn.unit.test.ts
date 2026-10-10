import { expect, test } from "vitest";
import { cleanupDatabaseFn } from "../../e2e/utils/cleanupDatabaseFn";

test("closes the application pool before dropping the test database", async () => {
	const operations: string[] = [];

	await cleanupDatabaseFn({
		databaseName: "example",
		closePoolFn: async () => {
			operations.push("pool");
		},
		cleanupFn: async () => {
			operations.push("database");
		},
	});

	expect(operations).toEqual([
		"pool",
		"database",
	]);
});

test("still drops the test database when application pool eviction fails", async () => {
	const poolError = new Error("Application unavailable");
	let dropped = false;

	const result = cleanupDatabaseFn({
		databaseName: "example",
		closePoolFn: async () => {
			throw poolError;
		},
		cleanupFn: async () => {
			dropped = true;
		},
	});

	await expect(result).rejects.toMatchObject({
		message: "Failed to clean up E2E database example",
		errors: [
			poolError,
		],
	});
	expect(dropped).toBe(true);
});

test("reports both pool eviction and database cleanup failures", async () => {
	const poolError = new Error("Application unavailable");
	const databaseError = new Error("Database unavailable");

	await expect(
		cleanupDatabaseFn({
			databaseName: "example",
			closePoolFn: async () => {
				throw poolError;
			},
			cleanupFn: async () => {
				throw databaseError;
			},
		}),
	).rejects.toMatchObject({
		errors: [
			poolError,
			databaseError,
		],
	});
});
