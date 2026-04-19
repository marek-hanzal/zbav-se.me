import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withCategoryMissQueryBuilderFx } from "~/session/category-miss/server/db/withCategoryMissQueryBuilderFx";
import { withCategoryMissSelectFx } from "~/session/category-miss/server/db/withCategoryMissSelectFx";
import { categoryMissCreateFx } from "~/session/category-miss/server/fx/categoryMissCreateFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";

describe("categoryMissCreateFx", () => {
	it("ignores short input and increments existing category miss rows", async () => {
		const database = await testabase("categoryMissCreateFx");

		return Effect.gen(function* () {
			yield* categoryMissCreateFx({
				fulltext: "pc",
				limit: 4,
			});
			yield* categoryMissCreateFx({
				fulltext: undefined,
				limit: 4,
			});

			const before = yield* Effect.promise(() =>
				database.kysely.selectFrom("category_miss").selectAll().execute(),
			);

			expect(before).toEqual([]);

			yield* categoryMissCreateFx({
				fulltext: "notebooky",
				limit: 4,
			});
			yield* categoryMissCreateFx({
				fulltext: "notebooky",
				limit: 4,
			});
			yield* categoryMissCreateFx({
				fulltext: "monitory",
				limit: 4,
			});

			const rows = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("category_miss")
					.select([
						"id",
						"category",
						"count",
					])
					.where("category", "=", "notebooky")
					.execute(),
			);

			expect(rows).toHaveLength(1);
			expect(rows[0]?.category).toBe("notebooky");
			expect(rows[0]?.count).toBe(2);

			const select = yield* withCategoryMissSelectFx({
				sort: [
					{
						field: "count",
						order: "desc",
					},
					{
						field: "category",
						order: "asc",
					},
				],
			});
			const filteredSelect = yield* withCategoryMissQueryBuilderFx({
				select,
				where: {
					category: null,
					fulltext: "not",
					idIn: rows.map((row) => row.id),
				},
			});
			const categorySelect = yield* withCategoryMissQueryBuilderFx({
				select,
				where: {
					category: "monitory",
				},
			});
			const sorted = yield* Effect.promise(() =>
				select
					.select([
						"cm.category",
						"cm.count",
					])
					.execute(),
			);
			const filtered = yield* Effect.promise(() =>
				filteredSelect
					.select([
						"cm.category",
						"cm.count",
					])
					.execute(),
			);
			const category = yield* Effect.promise(() =>
				categorySelect
					.select([
						"cm.category",
						"cm.count",
					])
					.executeTakeFirstOrThrow(),
			);

			expect(sorted.map((item) => item.category)).toEqual([
				"notebooky",
				"monitory",
			]);
			expect(
				filtered.map((item) => ({
					category: item.category,
					count: item.count,
				})),
			).toEqual([
				{
					category: "notebooky",
					count: 2,
				},
			]);
			expect(category.category).toBe("monitory");
			expect(category.count).toBe(1);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
