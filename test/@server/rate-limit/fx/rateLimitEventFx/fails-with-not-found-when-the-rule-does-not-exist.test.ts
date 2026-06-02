import { Effect } from "effect";
import { describe, it } from "vitest";
import { rateLimitEventFx } from "~/server/rate-limit/server/fx/rateLimitEventFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";

type BucketRow = {
	key: string;
	window: string;
	count: number;
};

function _compareBucketRows(a: BucketRow, b: BucketRow) {
	return a.window.localeCompare(b.window) || a.key.localeCompare(b.key);
}

describe("rateLimitEventFx", () => {
	it("fails with not found when the rule does not exist", async () => {
		const database = await testabase("rateLimitEventFx-missing-rule");

		return Effect.gen(function* () {
			const result = yield* Effect.either(
				rateLimitEventFx({
					rule: "missing:rule",
					key: [
						"user:404",
					],
				}),
			);

			expectTaggedErrorFx(result, {
				tag: "NotFoundErrorFx",
				messageIncludes: "missing:rule",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
