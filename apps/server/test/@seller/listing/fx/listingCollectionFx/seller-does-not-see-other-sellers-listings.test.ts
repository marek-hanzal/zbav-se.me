import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/@seller/listing/fx/listingCollectionFx";
import { auth } from "~/auth/auth";
import { createListingFx, withRuntimeFx } from "~test/fixture/transactionFixture";
import { testabase } from "~test/testabase";

describe("listingCollectionFx (seller)", () => {
	it("seller does not see other sellers' listings", async () => {
		const database = await testabase("sellerListing-isolation");
		const { api } = auth(() => database.dialect);

		const { user: seller1 } = await api.signUpEmail({
			body: {
				email: "seller1@seller-listing-iso.cz",
				name: "Seller1",
				password: "12345678",
			},
		});
		const { user: seller2 } = await api.signUpEmail({
			body: {
				email: "seller2@seller-listing-iso.cz",
				name: "Seller2",
				password: "12345678",
			},
		});

		const listing1 = await createListingFx(seller1.id).pipe(
			withRuntimeFx(database),
			Effect.runPromise,
		);
		const listing2 = await createListingFx(seller2.id).pipe(
			withRuntimeFx(database),
			Effect.runPromise,
		);

		const collection = await Effect.gen(function* () {
			return yield* listingCollectionFx({
				scope: {
					userId: seller1.id,
				},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const ids = collection.map((l) => l.id);
		expect(ids).toContain(listing1.id);
		expect(ids).not.toContain(listing2.id);
	});
});
