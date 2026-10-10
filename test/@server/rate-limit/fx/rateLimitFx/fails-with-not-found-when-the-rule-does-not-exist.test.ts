import { Effect } from "effect";
import { describe, it } from "vitest";
import { rateLimitFx } from "~/rate-limit/fx/rateLimitFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";

describe("rateLimitFx", () => {
	it("fails with not found when the rule does not exist", async () => {
		const database = await testabaseFn("rateLimitFx-missing-rule");

		return Effect.gen(function* () {
			const result = yield* Effect.result(
				rateLimitFx({
					rule: "missing:snapshot-rule",
					key: [
						"user:404",
					],
				}),
			);

			expectTaggedErrorFn(result, {
				tag: "NotFoundErrorFx",
				messageIncludes: "missing:snapshot-rule",
			});
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
