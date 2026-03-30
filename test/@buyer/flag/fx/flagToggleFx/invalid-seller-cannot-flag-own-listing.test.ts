import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { flagToggleFx } from "~/buyer/flag/server/fx/flagToggleFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createListingFx } from "~/test/utils/createListingFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("flagToggleFx", () => {
	it("invalid: seller cannot flag own listing", async () => {
		const database = await testabase("flagToggle-own-listing");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@flag-own.cz",
				name: "Seller",
				password: "12345678",
			},
		});

		const listing = await createListingFx(seller.id).pipe(
			withRuntimeFx(database),
			Effect.runPromise,
		);

		await expect(
			Effect.gen(function* () {
				yield* flagToggleFx({
					userId: seller.id,
					listingId: listing.id,
					toggle: true,
				});
			}).pipe(withRuntimeFx(database), Effect.runPromise),
		).rejects.toThrow();
	});
});
