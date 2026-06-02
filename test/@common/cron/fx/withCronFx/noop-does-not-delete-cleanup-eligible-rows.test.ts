import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { runCronAtFx } from "./runCronAtFx";
import { seedCategoryMissCleanupScenarioFx } from "./seedCronCleanupScenarioFx";

describe("withCronFx noop", () => {
	it("does not delete cleanup-eligible rows", async () => {
		const database = await testabase("withCronFx-noop-no-cleanup");

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
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
