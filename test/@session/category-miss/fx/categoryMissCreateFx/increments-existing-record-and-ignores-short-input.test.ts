import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { categoryMissCreateFx } from "~/session/category-miss/server/fx/categoryMissCreateFx";
import { testabase } from "~/test/testabase";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("categoryMissCreateFx", () => {
	it("ignores short input and increments existing category miss rows", async () => {
		const database = await testabase("categoryMissCreateFx");

		return Effect.gen(function* () {
			yield* categoryMissCreateFx({
				fulltext: "pc",
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

			const rows = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("category_miss")
					.select([
						"category",
						"count",
					])
					.where("category", "=", "notebooky")
					.execute(),
			);

			expect(rows).toHaveLength(1);
			expect(rows[0]?.category).toBe("notebooky");
			expect(rows[0]?.count).toBe(2);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
