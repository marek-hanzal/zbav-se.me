import { Effect } from "effect";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { getFeedDefaultCreate } from "~/buyer/feed/service/getFeedDefaultCreate";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";
import { expect, test } from "./test";

test("registers the shared user in database B", async ({ page, database, db }) => {
	return Effect.gen(function* () {
		yield* Effect.promise(async () => {
			const { api } = auth(() => database.dialect);

			await api.signUpEmail({
				body: {
					email: "shared-user@e2e.zbav.se.me",
					name: "shared-user",
					password: "12345678",
				},
			});
		});

		const seller = yield* Effect.promise(async () => {
			return database.kysely
				.selectFrom("user")
				.selectAll()
				.where("email", "=", "shared-user@e2e.zbav.se.me")
				.executeTakeFirstOrThrow();
		});

		yield* feedCreateFx({
			...getFeedDefaultCreate(`E2E feed B ${db}`),
			locationId: null,
			userId: seller.id,
		}).pipe(withRuntimeFx(database));

		const response = yield* Effect.promise(async () => {
			const result = await page.goto("/api/e2e");

			if (result === null) {
				throw new Error("Expected /api/e2e navigation response");
			}

			return result;
		});

		const routeResult = yield* Effect.promise(async () => {
			return response.json();
		});

		expect(routeResult).toEqual({
			db,
		});
	}).pipe(Effect.runPromise);
});
