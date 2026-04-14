import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionListingCollectionFx } from "~/seller/transaction-listing/server/fx/transactionListingCollectionFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityArchiveFx } from "~/user/activity/server/fx/activityArchiveFx";

describe("transactionListingCollectionFx (seller dashboard)", () => {
	it("active: false — after archiving activity, listing no longer appears as active", async () => {
		const database = await testabase("txListing-active-archived");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

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

			yield* activityArchiveFx({
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
