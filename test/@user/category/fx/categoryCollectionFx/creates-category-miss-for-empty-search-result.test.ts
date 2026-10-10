import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { categoryCollectionFx } from "~/user-category/fx/categoryCollectionFx";

describe("categoryCollectionFx", () => {
	it("creates category miss when collection is empty", async () => {
		const database = await testabaseFn("categoryCollectionFx-empty-miss");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});
			const fulltext = "totally-missing-category-search-phrase";

			const result = yield* categoryCollectionFx({
				userId: user.id,
				where: {
					fulltext: [
						fulltext,
					],
				},
				scope: {},
			});

			expect(result).toEqual([]);

			const miss = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("category_miss")
					.select([
						"category",
						"count",
					])
					.where("category", "=", fulltext)
					.executeTakeFirstOrThrow(),
			);

			expect(miss.category).toBe(fulltext);
			expect(miss.count).toBe(1);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
