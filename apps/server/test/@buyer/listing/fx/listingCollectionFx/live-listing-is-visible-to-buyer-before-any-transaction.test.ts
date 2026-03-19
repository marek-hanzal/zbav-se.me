import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/@buyer/listing/fx/listingCollectionFx";
import { auth } from "~/auth/auth";
import { createListingFx, withRuntimeFx } from "~test/fixture/transactionFixture";
import { testabase } from "~test/testabase";

describe("listingCollectionFx (buyer) — listing status visibility", () => {
	it("live listing is visible to buyer before any transaction", async () => {
		const database = await testabase("listingCollection-live-visible");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@listing-live.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@listing-live.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		const listing = await createListingFx(seller.id).pipe(
			withRuntimeFx(database),
			Effect.runPromise,
		);

		const collection = await Effect.gen(function* () {
			return yield* listingCollectionFx({
				userId: buyer.id,
				scope: {},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const ids = collection.map((l) => l.id);
		expect(ids).toContain(listing.id);
	});
});
