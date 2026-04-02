import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionListingCollectionFx } from "~/seller/transaction-listing/server/fx/transactionListingCollectionFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";

describe("transactionListingCollectionFx (seller dashboard)", () => {
	it("active: true — shows listings with unread buyer-message inbox", async () => {
		const database = await testabase("txListing-active-true");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@txlisting-active.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);
			const { user: buyer } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "buyer@txlisting-active.cz",
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
				where: {
					active: true,
				},
			});

			const item = collection.find((l) => l.id === listingId);

			expect(collection.map((l) => l.id)).toContain(listingId);
			expect(typeof item?.unreadCount).toBe("number");
			expect(item?.unreadCount).toBeGreaterThan(0);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
