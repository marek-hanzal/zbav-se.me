import { Effect } from "effect";
import { feedCreateFx } from "~/buyer-feed/fx/feedCreateFx";
import { getFeedDefaultCreateFn } from "~/buyer-feed/service/getFeedDefaultCreateFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { expect, testFn } from "../testFn";

testFn("registers the shared user in database A", async ({ page, database, db }) => {
	return Effect.gen(function* () {
		const seller = yield* leaseTestUserFx({
			key: "a",
		});

		yield* feedCreateFx({
			...getFeedDefaultCreateFn(`E2E feed A ${db}`),
			userId: seller.id,
		});

		const response = yield* Effect.promise(async () => {
			const result = await page.goto("/api/e2e");

			if (result === null) {
				throw new Error("Expected /api/e2e navigation response");
			}

			return await result.json();
		});

		expect(response).toEqual({
			db,
		});
	}).pipe(withRuntimeFn(database), Effect.runPromise);
});
