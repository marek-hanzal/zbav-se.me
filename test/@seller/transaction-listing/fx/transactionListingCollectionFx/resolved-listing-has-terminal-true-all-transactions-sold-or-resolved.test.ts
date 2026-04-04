import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionListingCollectionFx } from "~/seller/transaction-listing/server/fx/transactionListingCollectionFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createResolvedScenarioFx } from "~/test/transaction/fx/createResolvedScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionListingCollectionFx (seller dashboard)", () => {
	it("resolved listing has terminal: true — all transactions sold or resolved", async () => {
		const database = await testabase("txListing-resolved-terminal");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			const { listingId } = yield* createResolvedScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const collection = yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					terminal: false,
				},
			});

			expect(collection.map((l) => l.id)).toContain(listingId);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
