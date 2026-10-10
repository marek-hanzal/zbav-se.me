import { Effect } from "effect";
import { genIdFn } from "~/identity/fn/genIdFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import {
	leaseTestUserFx,
	TEST_USER_PASSWORD,
	toLeasedTestUserEmailFn,
} from "~/test/user/fx/leaseTestUserFx";
import { expect, testFn } from "../testFn";

testFn.use({
	dbName: "database-routing",
});

testFn("request-only fixtures allocate an application database", async ({ withRequestFn }) => {
	await withRequestFn(async (request) => {
		const response = await request.post("/api/auth/sign-in/email", {
			data: {
				email: toLeasedTestUserEmailFn("a"),
				password: TEST_USER_PASSWORD,
			},
		});

		expect(response.ok()).toBe(true);
		expect(await response.json()).toMatchObject({
			user: {
				email: toLeasedTestUserEmailFn("a"),
			},
		});
	});
});

testFn("application requests read database A", async ({ context, database, db, withRequestFn }) => {
	const user = await leaseTestUserFx({
		key: "a",
	}).pipe(withRuntimeFn(database), Effect.runPromise);
	const email = `routing-a-${genIdFn()}@x32.cz`;

	await database.kysely
		.updateTable("user")
		.set({
			email,
		})
		.where("id", "=", user.id)
		.execute();

	await withRequestFn(async (request) => {
		const response = await request.post("/api/auth/sign-in/email", {
			data: {
				email,
				password: user.password,
			},
		});

		expect(response.ok()).toBe(true);
		expect(response.headers()["x-e2e-db"]).toBe(db);
		expect(await response.json()).toMatchObject({
			user: {
				id: user.id,
				email,
			},
		});
	});

	const page = await context.newPage();
	const response = await page.goto("/api/e2e");

	expect(response).not.toBeNull();
	expect(await response?.json()).toEqual({
		db,
	});
});
