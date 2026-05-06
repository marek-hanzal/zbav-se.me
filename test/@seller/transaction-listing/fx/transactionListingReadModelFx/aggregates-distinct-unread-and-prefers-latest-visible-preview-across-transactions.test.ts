import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCreateFx } from "~/buyer/transaction/server/fx/transactionCreateFx";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { transactionListingCollectionFx } from "~/seller/transaction-listing/server/fx/transactionListingCollectionFx";
import { transactionListingFetchFx } from "~/seller/transaction-listing/server/fx/transactionListingFetchFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";

describe("seller transaction-listing read model", () => {
	it("counts unread by distinct transaction and keeps preview on the latest visible activity across transactions", async () => {
		const database = await testabase("seller-transaction-listing-distinct-unread-preview");

		return Effect.gen(function* () {
			const { seller, buyer, stranger } = yield* createUsersFx({});
			const listing = yield* createListingFx(seller.id, {
				title: "shared listing for transaction aggregation",
			});

			const pendingTransaction = yield* transactionCreateFx({
				listingId: listing.id,
				userId: buyer.id,
			});
			const openTransaction = yield* transactionCreateFx({
				listingId: listing.id,
				userId: stranger.id,
			});

			yield* transactionEntryCreateFx({
				userId: buyer.id,
				transactionId: pendingTransaction.id,
				kind: "text",
				payload: {
					text: "Pending buyer follow-up should stay hidden for seller preview",
				},
			});

			yield* transactionAcceptFx({
				transactionId: openTransaction.id,
				userId: seller.id,
			});

			const latestVisibleEntry = yield* transactionEntryCreateFx({
				userId: stranger.id,
				transactionId: openTransaction.id,
				kind: "text",
				payload: {
					text: "Visible buyer message in open transaction",
				},
			});

			const hiddenNewestPendingEntry = yield* transactionEntryCreateFx({
				userId: buyer.id,
				transactionId: pendingTransaction.id,
				kind: "text",
				payload: {
					text: "Newest hidden buyer message on pending transaction",
				},
			});

			const collection = yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
			});
			const fetched = yield* transactionListingFetchFx({
				scope: {
					userId: seller.id,
				},
				where: {
					id: listing.id,
				},
			});

			expect(collection.map((item) => item.id)).toContain(listing.id);
			expect(fetched.id).toBe(listing.id);
			expect(fetched.count).toBe(2);
			expect(fetched.unread).toBe(2);
			expect(fetched.entry.kind).toBe("text");
			expect(fetched.entry.id).toBe(latestVisibleEntry.id);
			expect(fetched.lastAt.getTime()).toBe(latestVisibleEntry.createdAt.getTime());
			expect(fetched.lastAt.getTime()).toBeLessThan(
				hiddenNewestPendingEntry.createdAt.getTime(),
			);

			const collectionItem = collection.find((item) => item.id === listing.id);
			expect(collectionItem?.count).toBe(2);
			expect(collectionItem?.unread).toBe(2);
			expect(collectionItem?.entry.id).toBe(latestVisibleEntry.id);
			expect(collectionItem?.lastAt.getTime()).toBe(latestVisibleEntry.createdAt.getTime());
			expect(collectionItem?.lastAt.getTime()).toBeLessThan(
				hiddenNewestPendingEntry.createdAt.getTime(),
			);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
