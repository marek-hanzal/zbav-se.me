import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { runCronAtFx } from "./runCronAtFx";
import { seedCategoryMissCleanupScenarioFx } from "./seedCronCleanupScenarioFx";

describe("withCronFx noop", () => {
	it("does not delete cleanup-eligible rows", async () => {
		const database = await testabaseFn("withCronFx-noop-no-cleanup");

		return Effect.gen(function* () {
			const categoryMissIds = yield* seedCategoryMissCleanupScenarioFx({
				database,
				cutoffIso: "2026-05-25T00:00:00.000Z",
			});

			yield* runCronAtFx({
				schedule: "noop",
				now: "2026-06-01T00:00:00.000Z",
			});

			const categoryMisses = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("category_miss")
					.select("id")
					.where("id", "in", Object.values(categoryMissIds))
					.execute(),
			);

			expect(categoryMisses).toHaveLength(3);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
