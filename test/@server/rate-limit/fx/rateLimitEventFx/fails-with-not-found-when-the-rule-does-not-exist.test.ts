import { Effect } from "effect";
import { describe, it } from "vitest";
import { rateLimitEventFx } from "~/rate-limit/fx/rateLimitEventFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";

type BucketRow = {
	key: string;
	window: string;
	count: number;
};

function _compareBucketRowsFn(a: BucketRow, b: BucketRow) {
	return a.window.localeCompare(b.window) || a.key.localeCompare(b.key);
}

describe("rateLimitEventFx", () => {
	it("fails with not found when the rule does not exist", async () => {
		const database = await testabaseFn("rateLimitEventFx-missing-rule");

		return Effect.gen(function* () {
			const result = yield* Effect.result(
				rateLimitEventFx({
					rule: "missing:rule",
					key: [
						"user:404",
					],
				}),
			);

			expectTaggedErrorFn(result, {
				tag: "NotFoundErrorFx",
				messageIncludes: "missing:rule",
			});
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
