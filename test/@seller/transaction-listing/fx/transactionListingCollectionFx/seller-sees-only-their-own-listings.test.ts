import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionListingCollectionFx } from "~/seller/transaction-listing/server/fx/transactionListingCollectionFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionListingCollectionFx (seller dashboard)", () => {
	it("seller sees only their own listings", async () => {
		const database = await testabase("txListing-scope-isolation");

		return Effect.gen(function* () {
			const seller1 = yield* leaseTestUserFx({});
			const seller2 = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

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
