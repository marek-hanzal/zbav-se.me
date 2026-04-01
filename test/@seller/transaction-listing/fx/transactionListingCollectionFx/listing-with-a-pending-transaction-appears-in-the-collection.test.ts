import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionListingCollectionFx } from "~/seller/transaction-listing/server/fx/transactionListingCollectionFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/utils/createPendingScenarioFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("transactionListingCollectionFx (seller dashboard)", () => {
	it("listing with a pending transaction appears in the collection", async () => {
		const database = await testabase("txListing-with-pending");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@txlisting-pending.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);
			const { user: buyer } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "buyer@txlisting-pending.cz",
						name: "Buyer",
						password: "12345678",
					},
				}),
			);

			const { listingId } = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const collection = yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
			});

			const item = collection.find((l) => l.id === listingId);

			const ids = collection.map((l) => l.id);
			expect(ids).toContain(listingId);
			expect(typeof item?.count).toBe("number");
			expect(item?.count).toBe(1);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
