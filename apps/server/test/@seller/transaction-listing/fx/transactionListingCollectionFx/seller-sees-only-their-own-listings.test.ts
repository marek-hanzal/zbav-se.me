import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionListingCollectionFx } from "~/@seller/transaction-listing/fx/transactionListingCollectionFx";
import { auth } from "~/auth/auth";
import { createPendingScenarioFx, withRuntimeFx } from "~test/fixture/transactionFixture";
import { testabase } from "~test/testabase";

describe("transactionListingCollectionFx (seller dashboard)", () => {
	it("seller sees only their own listings", async () => {
		const database = await testabase("txListing-scope-isolation");
		const { api } = auth(() => database.dialect);

		const { user: seller1 } = await api.signUpEmail({
			body: {
				email: "seller1@txlisting-scope.cz",
				name: "Seller1",
				password: "12345678",
			},
		});
		const { user: seller2 } = await api.signUpEmail({
			body: {
				email: "seller2@txlisting-scope.cz",
				name: "Seller2",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@txlisting-scope.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		const { listingId: listing1 } = await createPendingScenarioFx({
			sellerId: seller1.id,
			buyerId: buyer.id,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const { listingId: listing2 } = await createPendingScenarioFx({
			sellerId: seller2.id,
			buyerId: buyer.id,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const seller1Collection = await Effect.gen(function* () {
			return yield* transactionListingCollectionFx({
				scope: {
					userId: seller1.id,
				},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const ids = seller1Collection.map((l) => l.id);
		expect(ids).toContain(listing1);
		expect(ids).not.toContain(listing2);
	});
});
