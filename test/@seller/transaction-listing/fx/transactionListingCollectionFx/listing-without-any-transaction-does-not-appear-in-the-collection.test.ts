import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionListingCollectionFx } from "~/seller/transaction-listing/server/fx/transactionListingCollectionFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";

describe("transactionListingCollectionFx (seller dashboard)", () => {
	it("listing without any transaction does not appear in the collection", async () => {
		const database = await testabase("txListing-no-tx");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@txlisting-no-tx.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);

			const listing = yield* createListingFx(seller.id);

			const collection = yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
			});

			const ids = collection.map((l) => l.id);
			expect(ids).not.toContain(listing.id);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
