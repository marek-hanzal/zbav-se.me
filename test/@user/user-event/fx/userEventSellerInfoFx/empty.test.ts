import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/buyer/user-event/server/fx/userEventSellerInfoFx";
import { testabase } from "~/test/testabase";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("userEventSellerInfoFx", () => {
	it("Empty user's info returns nothing", async () => {
		const kysely = await testabase("userEventSellerInfoFx-empty");

		return Effect.gen(function* () {
			const result = yield* userEventSellerInfoFx({
				userId: "test-user-id",
			});

			expect(result).toBeNull();
		}).pipe(withRuntimeFx(kysely), Effect.runPromise);
	});
});
