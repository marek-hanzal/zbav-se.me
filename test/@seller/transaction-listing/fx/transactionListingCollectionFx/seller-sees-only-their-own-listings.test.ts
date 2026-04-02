import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionListingCollectionFx } from "~/seller/transaction-listing/server/fx/transactionListingCollectionFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";

describe("transactionListingCollectionFx (seller dashboard)", () => {
	it("seller sees only their own listings", async () => {
		const database = await testabase("txListing-scope-isolation");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { user: seller1 } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller1@txlisting-scope.cz",
						name: "Seller1",
						password: "12345678",
					},
				}),
			);
			const { user: seller2 } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller2@txlisting-scope.cz",
						name: "Seller2",
						password: "12345678",
					},
				}),
			);
			const { user: buyer } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "buyer@txlisting-scope.cz",
						name: "Buyer",
						password: "12345678",
					},
				}),
			);

			const { listingId: listing1 } = yield* createPendingScenarioFx({
				sellerId: seller1.id,
				buyerId: buyer.id,
			});

			const { listingId: listing2 } = yield* createPendingScenarioFx({
				sellerId: seller2.id,
				buyerId: buyer.id,
			});

			const seller1Collection = yield* transactionListingCollectionFx({
				scope: {
					userId: seller1.id,
				},
			});

			const ids = seller1Collection.map((l) => l.id);
			expect(ids).toContain(listing1);
			expect(ids).not.toContain(listing2);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
