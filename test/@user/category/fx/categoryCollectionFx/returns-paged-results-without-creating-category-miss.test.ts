import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { categoryCollectionFx } from "~/user-category/fx/categoryCollectionFx";

describe("categoryCollectionFx", () => {
	it("returns paged data for matching categories and does not create category miss", async () => {
		const database = await testabaseFn("categoryCollectionFx-non-empty");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});
			const fulltext = "pocitace";

			const firstPage = yield* categoryCollectionFx({
				userId: user.id,
				where: {
					fulltext: [
						fulltext,
					],
				},
				cursor: {
					page: 0,
					size: 1,
				},
				scope: {},
			});
			const secondPage = yield* categoryCollectionFx({
				userId: user.id,
				where: {
					fulltext: [
						fulltext,
					],
				},
				cursor: {
					page: 1,
					size: 1,
				},
				scope: {},
			});

			expect(firstPage).toHaveLength(1);
			expect(secondPage).toHaveLength(1);
			expect(firstPage[0]?.id).not.toBe(secondPage[0]?.id);

			const miss = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("category_miss")
					.select("id")
					.where("category", "=", fulltext)
					.executeTakeFirst(),
			);

			expect(miss).toBeUndefined();
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
