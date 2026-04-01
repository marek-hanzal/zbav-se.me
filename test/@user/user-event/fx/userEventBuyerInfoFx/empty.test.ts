import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { userEventBuyerInfoFx } from "~/seller/user-event/server/fx/userEventBuyerInfoFx";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { testabase } from "~/test/testabase";

describe("userEventBuyerInfoFx", () => {
	it("Empty user's info returns nothing", async () => {
		const kysely = await testabase("userEventBuyerInfoFx-empty");

		return Effect.gen(function* () {
			const result = yield* userEventBuyerInfoFx({
				userId: "test-user-id",
			});

			expect(result).toBeNull();
		}).pipe(withKyselyFx(kysely), withDateFx, Effect.runPromise);
	});
});
