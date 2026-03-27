import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/client/@seller/listing/server/fx/listingCollectionFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createResolvedScenarioFx } from "~/test/utils/createResolvedScenarioFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("listingCollectionFx (seller)", () => {
	it("seller sees their sold listing (unlike buyer who only sees live)", async () => {
		const database = await testabase("sellerListing-sold-visible");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@seller-listing-sold.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@seller-listing-sold.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		// Resolve → listing becomes "sold"
		const { listingId } = await createResolvedScenarioFx({
			sellerId: seller.id,
			buyerId: buyer.id,
			database,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const { status } = await database.kysely
			.selectFrom("listing")
			.select("status")
			.where("id", "=", listingId)
			.executeTakeFirstOrThrow();

		expect(status).toBe("sold");

		// Seller listing collection has no status filter — sold listing is visible
		const collection = await Effect.gen(function* () {
			return yield* listingCollectionFx({
				scope: {
					userId: seller.id,
				},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		expect(collection.map((l) => l.id)).toContain(listingId);
	});
});
