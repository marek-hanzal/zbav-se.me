import { Effect } from "effect";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { getFeedDefaultCreate } from "~/buyer/feed/service/getFeedDefaultCreate";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { expect, test } from "../test";

test("registers the shared user in database B", async ({ page, database, db }) => {
	return Effect.gen(function* () {
		const seller = yield* leaseTestUserFx({
			key: "a",
		});

		yield* feedCreateFx({
			...getFeedDefaultCreate(`E2E feed B ${db}`),
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
	}).pipe(withRuntimeFx(database), Effect.runPromise);
});
