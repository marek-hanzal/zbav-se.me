import { Effect } from "effect";
import { describe, it } from "vitest";
import { rateLimitCheckFx } from "~/server/rate-limit/server/fx/rateLimitCheckFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";

describe("rateLimitCheckFx", () => {
	it("fails with not found when the rule does not exist", async () => {
		const database = await testabase("rateLimitCheckFx-missing-rule");

		return Effect.gen(function* () {
			const result = yield* Effect.either(
				rateLimitCheckFx({
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
