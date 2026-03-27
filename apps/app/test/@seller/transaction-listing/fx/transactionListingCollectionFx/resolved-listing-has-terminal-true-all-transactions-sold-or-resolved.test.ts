import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionListingCollectionFx } from "~/@seller/transaction-listing/server/fx/transactionListingCollectionFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createResolvedScenarioFx } from "~/test/utils/createResolvedScenarioFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("transactionListingCollectionFx (seller dashboard)", () => {
	it("resolved listing has terminal: true — all transactions sold or resolved", async () => {
		const database = await testabase("txListing-resolved-terminal");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@txlisting-resolved.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@txlisting-resolved.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		const { listingId } = await createResolvedScenarioFx({
			sellerId: seller.id,
			buyerId: buyer.id,
			database,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// After resolve, transactionResolveFx sets other transactions to "sold"
		// The resolved transaction itself is in "resolved" state — NOT terminal
		// (pending/open/resolved/dispute are non-terminal per the query builder)
		const collection = await Effect.gen(function* () {
			return yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					terminal: false,
				},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		expect(collection.map((l) => l.id)).toContain(listingId);
	});
});
