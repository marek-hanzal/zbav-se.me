import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { flagToggleFx } from "~/@buyer/flag/fx/flagToggleFx";
import { auth } from "~/auth/auth";
import { testabase } from "~/test/testabase";
import { createListingFx } from "~/test/utils/createListingFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("flagToggleFx", () => {
	it("invalid: cannot flag an already-flagged listing (conflict on insert)", async () => {
		const database = await testabase("flagToggle-duplicate");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@flag-duplicate.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@flag-duplicate.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		const listing = await createListingFx(seller.id).pipe(
			withRuntimeFx(database),
			Effect.runPromise,
		);

		// First flag succeeds
		await Effect.gen(function* () {
			yield* flagToggleFx({
				userId: buyer.id,
				listingId: listing.id,
				toggle: true,
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// Second flag throws because doNothing causes executeTakeFirstOrThrow to fail
		await expect(
			Effect.gen(function* () {
				yield* flagToggleFx({
					userId: buyer.id,
					listingId: listing.id,
					toggle: true,
				});
			}).pipe(withRuntimeFx(database), Effect.runPromise),
		).rejects.toThrow();
	});
});
