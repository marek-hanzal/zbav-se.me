import { Effect } from "effect";
import { describe, it } from "vitest";
import { rateLimitFx } from "~/server/rate-limit/server/fx/rateLimitFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";

describe("rateLimitFx", () => {
	it("fails with not found when the rule does not exist", async () => {
		const database = await testabase("rateLimitFx-missing-rule");

		return Effect.gen(function* () {
			const result = yield* Effect.either(
				rateLimitFx({
					rule: "missing:snapshot-rule",
					key: [
						"user:404",
					],
				}),
			);

			expectTaggedErrorFx(result, {
				tag: "NotFoundErrorFx",
				messageIncludes: "missing:snapshot-rule",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
