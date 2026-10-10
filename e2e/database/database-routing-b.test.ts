import { Effect } from "effect";
import { genIdFn } from "~/identity/fn/genIdFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { expect, testFn } from "../testFn";

testFn.use({
	dbName: "database-routing",
});

testFn("application requests read database B", async ({ page, database, db, withRequestFn }) => {
	const user = await leaseTestUserFx({
		key: "a",
	}).pipe(withRuntimeFn(database), Effect.runPromise);
	const email = `routing-b-${genIdFn()}@x32.cz`;

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

	const response = await page.goto("/api/e2e");

	expect(response).not.toBeNull();
	expect(await response?.json()).toEqual({
		db,
	});
});
