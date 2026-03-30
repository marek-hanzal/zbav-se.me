import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { ignoreToggleFx } from "~/buyer/ignore/server/fx/ignoreToggleFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createListingFx } from "~/test/utils/createListingFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("ignoreToggleFx", () => {
	it("invalid: seller cannot ignore own listing", async () => {
		const database = await testabase("ignoreToggle-own-listing");

		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller } = yield* Effect.promise(async () =>
				api.signUpEmail({
					body: {
						email: "seller@ignore-own.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);

			const listing = yield* createListingFx(seller.id);

			const result = yield* Effect.either(
				ignoreToggleFx({
					userId: seller.id,
					listingId: listing.id,
					toggle: true,
				}),
			);

			expect(result._tag).toBe("Left");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
