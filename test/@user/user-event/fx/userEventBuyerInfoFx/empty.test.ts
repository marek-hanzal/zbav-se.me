import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { userEventBuyerInfoFx } from "~/seller/user-event/server/fx/userEventBuyerInfoFx";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { testabase } from "~/test/testabase";

describe("userEventBuyerInfoFx", () => {
	it("Empty user's info returns nothing", async () => {
		const kysely = await testabase("userEventBuyerInfoFx-empty");

		const result = await Effect.gen(function* () {
			return yield* userEventBuyerInfoFx({
				userId: "test-user-id",
			});
		}).pipe(withKyselyFx(kysely), withDateFx, Effect.runPromise);

		expect(result).toBeNull();
	});
});
