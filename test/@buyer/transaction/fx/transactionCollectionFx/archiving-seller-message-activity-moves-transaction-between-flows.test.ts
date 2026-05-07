import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCollectionFx } from "~/buyer/transaction/server/fx/transactionCollectionFx";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { getDefaultListingCreateFx } from "~/test/listing/fx/getDefaultListingCreateFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityArchiveFx } from "~/user/activity/server/fx/activityArchiveFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";

describe("buyer transactionCollectionFx", () => {
	it("reveals older seller-message activity before moving an open transaction back to buyer-to-seller", async () => {
		const database = await testabase("buyer-transactionCollection-archive-seller-message-flow");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});
			const listing = yield* getDefaultListingCreateFx;

			const scenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				listing,
			});

			yield* transactionAcceptFx({
				transactionId: scenario.transactionId,
				userId: seller.id,
			});
			yield* transactionEntryCreateFx({
				userId: seller.id,
				transactionId: scenario.transactionId,
				kind: "text",
				payload: {
					text: "Seller ping after accept",
				},
			});

			const sellerToBuyerBeforeArchive = yield* transactionCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					flow: "seller-to-buyer",
				},
			});

			yield* activityArchiveFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					type: "seller-message",
					reference: scenario.transactionId,
				},
			});

			const sellerToBuyerAfterFirstArchive = yield* transactionCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					flow: "seller-to-buyer",
				},
			});

			yield* activityArchiveFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					type: "seller-message",
					reference: scenario.transactionId,
				},
			});

			const sellerToBuyerAfterSecondArchive = yield* transactionCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					flow: "seller-to-buyer",
				},
			});
			const buyerToSellerAfterSecondArchive = yield* transactionCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					flow: "buyer-to-seller",
				},
			});

			expect(sellerToBuyerBeforeArchive.map((item) => item.id)).toEqual([
				scenario.transactionId,
			]);
			expect(sellerToBuyerBeforeArchive[0]?.unread).toBe(2);
			expect(sellerToBuyerAfterFirstArchive.map((item) => item.id)).toEqual([
				scenario.transactionId,
			]);
			expect(sellerToBuyerAfterFirstArchive[0]?.unread).toBe(1);
			expect(sellerToBuyerAfterSecondArchive).toEqual([]);
			expect(buyerToSellerAfterSecondArchive.map((item) => item.id)).toEqual([
				scenario.transactionId,
			]);
			expect(buyerToSellerAfterSecondArchive[0]?.unread).toBe(0);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
