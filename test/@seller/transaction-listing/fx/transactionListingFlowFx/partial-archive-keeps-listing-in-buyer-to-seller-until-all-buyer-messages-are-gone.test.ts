import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCreateFx } from "~/buyer/transaction/server/fx/transactionCreateFx";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { transactionListingCollectionFx } from "~/seller/transaction-listing/server/fx/transactionListingCollectionFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { activityArchiveFx } from "~/user/activity/server/fx/activityArchiveFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";

describe("seller transaction-listing flows", () => {
	it("stays in buyer-to-seller until every buyer-message under the listing is archived", async () => {
		const database = await testabase("seller-transaction-listing-partial-archive-flow");

		return Effect.gen(function* () {
			const { seller, buyer, stranger } = yield* createUsersFx({});
			const listing = yield* createListingFx(seller.id, {
				title: "listing with mixed transaction flows",
			});

			const pendingTransaction = yield* transactionCreateFx({
				listingId: listing.id,
				userId: buyer.id,
			});
			const openTransaction = yield* transactionCreateFx({
				listingId: listing.id,
				userId: stranger.id,
			});

			yield* transactionAcceptFx({
				transactionId: openTransaction.id,
				userId: seller.id,
			});
			yield* transactionEntryCreateFx({
				userId: buyer.id,
				transactionId: pendingTransaction.id,
				kind: "text",
				payload: {
					text: "Pending buyer follow-up",
				},
			});
			yield* transactionEntryCreateFx({
				userId: stranger.id,
				transactionId: openTransaction.id,
				kind: "text",
				payload: {
					text: "Open buyer follow-up",
				},
			});

			const buyerToSellerBeforeArchive = yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					flow: "buyer-to-seller",
				},
			});

			yield* activityArchiveFx({
				scope: {
					userId: seller.id,
				},
				where: {
					type: "buyer-message",
					reference: openTransaction.id,
				},
			});

			const buyerToSellerAfterPartialArchive = yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					flow: "buyer-to-seller",
				},
			});
			const sellerToBuyerAfterPartialArchive = yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					flow: "seller-to-buyer",
				},
			});

			yield* activityArchiveFx({
				scope: {
					userId: seller.id,
				},
				where: {
					type: "buyer-message",
					reference: pendingTransaction.id,
				},
			});

			const buyerToSellerAfterFullArchive = yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					flow: "buyer-to-seller",
				},
			});
			const sellerToBuyerAfterFullArchive = yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					flow: "seller-to-buyer",
				},
			});

			expect(buyerToSellerBeforeArchive.map((item) => item.id)).toEqual([
				listing.id,
			]);
			expect(buyerToSellerBeforeArchive[0]?.unread).toBe(2);
			expect(buyerToSellerAfterPartialArchive.map((item) => item.id)).toEqual([
				listing.id,
			]);
			expect(buyerToSellerAfterPartialArchive[0]?.unread).toBe(1);
			expect(sellerToBuyerAfterPartialArchive).toEqual([]);
			expect(buyerToSellerAfterFullArchive).toEqual([]);
			expect(sellerToBuyerAfterFullArchive.map((item) => item.id)).toEqual([
				listing.id,
			]);
			expect(sellerToBuyerAfterFullArchive[0]?.unread).toBe(0);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
