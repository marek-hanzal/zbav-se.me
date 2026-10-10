import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCreateFx } from "~/buyer-transaction/fx/transactionCreateFx";
import { listingCollectionFx } from "~/seller-listing/fx/listingCollectionFx";
import { transactionAcceptFx } from "~/seller-transaction/fx/transactionAcceptFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabaseFn } from "~/test/testabaseFn";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { activityArchiveFx } from "~/user-activity/fx/activityArchiveFx";
import { transactionEntryCreateFx } from "~/user-transaction-entry/fx/transactionEntryCreateFx";

describe("seller listing flows", () => {
	it("stays in buyer-to-seller until every buyer-message under the listing is archived", async () => {
		const database = await testabaseFn("seller-listing-partial-archive-flow");

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

			const buyerToSellerBeforeArchive = yield* listingCollectionFx({
				userId: seller.id,
				scope: {
					userId: seller.id,
				},
				where: {
					flow: "buyer-to-seller",
					withTransaction: true,
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

			const buyerToSellerAfterPartialArchive = yield* listingCollectionFx({
				userId: seller.id,
				scope: {
					userId: seller.id,
				},
				where: {
					flow: "buyer-to-seller",
					withTransaction: true,
				},
			});
			const sellerToBuyerAfterPartialArchive = yield* listingCollectionFx({
				userId: seller.id,
				scope: {
					userId: seller.id,
				},
				where: {
					flow: "seller-to-buyer",
					withTransaction: true,
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

			const buyerToSellerAfterFullArchive = yield* listingCollectionFx({
				userId: seller.id,
				scope: {
					userId: seller.id,
				},
				where: {
					flow: "buyer-to-seller",
					withTransaction: true,
				},
			});
			const sellerToBuyerAfterFullArchive = yield* listingCollectionFx({
				userId: seller.id,
				scope: {
					userId: seller.id,
				},
				where: {
					flow: "seller-to-buyer",
					withTransaction: true,
				},
			});

			expect(buyerToSellerBeforeArchive.map((item) => item.id)).toEqual([
				listing.id,
			]);
			expect(buyerToSellerBeforeArchive[0]?.withUnreadCount).toBe(2);
			expect(buyerToSellerAfterPartialArchive.map((item) => item.id)).toEqual([
				listing.id,
			]);
			expect(buyerToSellerAfterPartialArchive[0]?.withUnreadCount).toBe(1);
			expect(sellerToBuyerAfterPartialArchive).toEqual([]);
			expect(buyerToSellerAfterFullArchive).toEqual([]);
			expect(sellerToBuyerAfterFullArchive.map((item) => item.id)).toEqual([
				listing.id,
			]);
			expect(sellerToBuyerAfterFullArchive[0]?.withUnreadCount).toBe(0);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
