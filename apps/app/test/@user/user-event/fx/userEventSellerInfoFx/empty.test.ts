import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/@buyer/user-event/fx/userEventSellerInfoFx";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { testabase } from "~/test/testabase";

describe("userEventSellerInfoFx", () => {
	it("Empty user's info returns nothing", async () => {
		const kysely = await testabase("userEventSellerInfoFx-empty");

		const result = await Effect.gen(function* () {
			return yield* userEventSellerInfoFx({
				userId: "test-user-id",
			});
		}).pipe(withKyselyFx(kysely), withDateFx, Effect.runPromise);

		expect(result).toBeNull();
	});
});
