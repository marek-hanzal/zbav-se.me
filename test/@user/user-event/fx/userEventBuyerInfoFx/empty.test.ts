import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { userEventBuyerInfoFx } from "~/seller/user-event/server/fx/userEventBuyerInfoFx";
import { testabase } from "~/test/testabase";
import { withUserEventRuntimeFx } from "~/test/utils/withUserEventRuntimeFx";

describe("userEventBuyerInfoFx", () => {
	it("Empty user's info returns nothing", async () => {
		const kysely = await testabase("userEventBuyerInfoFx-empty");

		return Effect.gen(function* () {
			const result = yield* userEventBuyerInfoFx({
				userId: "test-user-id",
			});

			expect(result).toBeNull();
		}).pipe(withUserEventRuntimeFx(kysely), Effect.runPromise);
	});
});
