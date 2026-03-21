import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { userEventBuyerInfoFx } from "~/@buyer/user-event/fx/userEventBuyerInfoFx";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
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
