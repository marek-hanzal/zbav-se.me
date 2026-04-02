import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { flagToggleFx } from "~/buyer/flag/server/fx/flagToggleFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";

describe("flagToggleFx", () => {
	it("invalid: seller cannot flag own listing", async () => {
		const database = await testabase("flagToggle-own-listing");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@flag-own.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);

			const listing = yield* createListingFx(seller.id);

			const result = yield* Effect.either(
				flagToggleFx({
					userId: seller.id,
					listingId: listing.id,
					toggle: true,
				}),
			);

			expect(result._tag).toBe("Left");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
