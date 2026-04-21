import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { categoryCollectionFx } from "~/user/category/server/fx/categoryCollectionFx";

describe("categoryCollectionFx", () => {
	it("creates category miss when collection is empty", async () => {
		const database = await testabase("categoryCollectionFx-empty-miss");

		return Effect.gen(function* () {
			const fulltext = "totally-missing-category-search-phrase";

			const result = yield* categoryCollectionFx({
				filter: {
					fulltext,
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
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
