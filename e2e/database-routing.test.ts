import { Effect } from "effect";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { getFeedDefaultCreate } from "~/buyer/feed/service/getFeedDefaultCreate";
import { ensureSeedUserFx } from "~/server/@system/seed/fx/ensureSeedUserFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";
import { expect, test } from "./test";

function toSeedEmail(databaseName: string) {
	return `${databaseName}@e2e.zbav.se.me`;
}

test("routes browser traffic to the per-test database", async ({ page, database, db }) => {
	const feedName = "E2E feed";
	const email = toSeedEmail(db);

	return Effect.gen(function* () {
		const seller = yield* ensureSeedUserFx({
			email,
		}).pipe(withRuntimeFx(database));

		yield* feedCreateFx({
			...getFeedDefaultCreate(feedName),
			locationId: null,
			userId: seller.id,
		}).pipe(withRuntimeFx(database));

		yield* Effect.promise(async () => {
			await page.goto("/cs/landing");
		});

		const routeResult = yield* Effect.promise(async () => {
			return page.evaluate(
				async ({ db }) => {
					const response = await fetch(new URL("/api/e2e", window.location.origin), {
						headers: {
							"x-e2e-db": db,
						},
					});

					return response.json();
				},
				{
					db,
				},
			);
		});

		expect(routeResult).toEqual({
			db,
		});
	}).pipe(Effect.runPromise);
});
