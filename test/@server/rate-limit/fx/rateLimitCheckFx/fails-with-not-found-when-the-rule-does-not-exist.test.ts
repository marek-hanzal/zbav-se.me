import { Effect } from "effect";
import { describe, it } from "vitest";
import { rateLimitCheckFx } from "~/rate-limit/fx/rateLimitCheckFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";

describe("rateLimitCheckFx", () => {
	it("fails with not found when the rule does not exist", async () => {
		const database = await testabaseFn("rateLimitCheckFx-missing-rule");

		return Effect.gen(function* () {
			const result = yield* Effect.result(
				rateLimitCheckFx({
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
