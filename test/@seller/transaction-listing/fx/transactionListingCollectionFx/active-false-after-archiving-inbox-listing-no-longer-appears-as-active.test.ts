import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionListingCollectionFx } from "~/seller/transaction-listing/server/fx/transactionListingCollectionFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { inboxArchiveFx } from "~/user/inbox/server/fx/inboxArchiveFx";

describe("transactionListingCollectionFx (seller dashboard)", () => {
	it("active: false — after archiving inbox, listing no longer appears as active", async () => {
		const database = await testabase("txListing-active-archived");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@txlisting-archived.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);
			const { user: buyer } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "buyer@txlisting-archived.cz",
						name: "Buyer",
						password: "12345678",
					},
				}),
			);

			const { listingId } = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const before = yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					active: true,
				},
			});

			expect(before.map((l) => l.id)).toContain(listingId);

			yield* inboxArchiveFx({
				scope: {
					userId: seller.id,
				},
				where: {
					reference: listingId,
					family: "transaction",
				},
			});

			const after = yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					active: true,
				},
			});

			expect(after.map((l) => l.id)).not.toContain(listingId);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
