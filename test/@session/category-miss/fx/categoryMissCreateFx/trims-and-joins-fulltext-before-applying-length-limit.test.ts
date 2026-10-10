import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { categoryMissCreateFx } from "~/session-category-miss/fx/categoryMissCreateFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";

describe("categoryMissCreateFx", () => {
	it("trims joined fulltext but keeps inner spacing when applying the length limit", async () => {
		const database = await testabaseFn("categoryMissCreateFx-trim-join-limit");

		return Effect.gen(function* () {
			yield* categoryMissCreateFx({
				fulltext: [
					"  aa ",
					" b ",
				],
				limit: 4,
			});
			yield* categoryMissCreateFx({
				fulltext: [
					"  a ",
					" b ",
				],
				limit: 4,
			});

			const rows = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("category_miss")
					.select([
						"category",
						"count",
					])
					.execute(),
			);

			expect(rows).toEqual([
				{
					category: "aa   b",
					count: 1,
				},
				{
					category: "a   b",
					count: 1,
				},
			]);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
