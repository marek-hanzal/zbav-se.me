import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/buyer-user-event/fx/userEventSellerInfoFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";

describe("userEventSellerInfoFx", () => {
	it("Empty user's info returns nothing", async () => {
		const kysely = await testabaseFn("userEventSellerInfoFx-empty");

		return Effect.gen(function* () {
			const result = yield* userEventSellerInfoFx({
				userId: "test-user-id",
			});

			expect(result).toBeNull();
		}).pipe(withRuntimeFn(kysely), Effect.runPromise);
	});
});
