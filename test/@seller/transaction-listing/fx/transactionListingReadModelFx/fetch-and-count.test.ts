import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { transactionListingCollectionFx } from "~/seller/transaction-listing/server/fx/transactionListingCollectionFx";
import { transactionListingCountFx } from "~/seller/transaction-listing/server/fx/transactionListingCountFx";
import { transactionListingFetchFx } from "~/seller/transaction-listing/server/fx/transactionListingFetchFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { getDefaultListingCreateFx } from "~/test/listing/fx/getDefaultListingCreateFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("seller transaction-listing read model fetch and count", () => {
	it("filters fetch and count by ids inside seller scope", async () => {
		const database = await testabase("sellerTransactionListingReadModelFx-filters-fetch-count");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});
			const listing = yield* getDefaultListingCreateFx;

			const pendingScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				listing,
			});
			const openScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				listing,
			});
			yield* transactionAcceptFx({
				transactionId: openScenario.transactionId,
				userId: seller.id,
			});

			const mixedIds = yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					idIn: [
						pendingScenario.listingId,
						openScenario.listingId,
					],
				},
			});
			const nonTerminalCount = yield* transactionListingCountFx({
				scope: {
					userId: seller.id,
				},
				where: {
					terminal: false,
				},
			});
			const fetched = yield* transactionListingFetchFx({
				scope: {
					userId: seller.id,
				},
				where: {
					id: openScenario.listingId,
				},
			});

			expect(mixedIds.map((item) => item.id).sort()).toEqual(
				[
					pendingScenario.listingId,
					openScenario.listingId,
				].sort(),
			);
			expect(nonTerminalCount.where).toBe(2);
			expect(fetched.id).toBe(openScenario.listingId);
			expect(typeof fetched.count).toBe("number");
			expect(typeof fetched.unreadCount).toBe("number");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
