import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { userEventBuyerInfoFx } from "~/seller-user-event/fx/userEventBuyerInfoFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";

describe("userEventBuyerInfoFx", () => {
	it("Empty user's info returns nothing", async () => {
		const kysely = await testabaseFn("userEventBuyerInfoFx-empty");

		return Effect.gen(function* () {
			const result = yield* userEventBuyerInfoFx({
				userId: "test-user-id",
			});

			expect(result).toBeNull();
		}).pipe(withRuntimeFn(kysely), Effect.runPromise);
	});
});
