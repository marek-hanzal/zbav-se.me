import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionListingCollectionFx } from "~/client/@seller/transaction-listing/server/fx/transactionListingCollectionFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/utils/createPendingScenarioFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("transactionListingCollectionFx (seller dashboard)", () => {
	it("active: true — shows listings with unread buyer-message inbox", async () => {
		const database = await testabase("txListing-active-true");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@txlisting-active.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@txlisting-active.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		// Pending transaction → seller gets unread buyer-message inbox
		const { listingId } = await createPendingScenarioFx({
			sellerId: seller.id,
			buyerId: buyer.id,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const collection = await Effect.gen(function* () {
			return yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					active: true,
				},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		expect(collection.map((l) => l.id)).toContain(listingId);
	});
});
