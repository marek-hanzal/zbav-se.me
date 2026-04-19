import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionListingCollectionFx } from "~/seller/transaction-listing/server/fx/transactionListingCollectionFx";
import { transactionListingFetchFx } from "~/seller/transaction-listing/server/fx/transactionListingFetchFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";

describe("transactionListingCollectionFx (seller dashboard)", () => {
	it("listing with an interest transaction appears in the collection", async () => {
		const database = await testabase("txListing-with-interest");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			const { listingId, transactionId } = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			const hiddenTextEntry = yield* transactionEntryCreateFx({
				userId: buyer.id,
				transactionId,
				kind: "text",
				payload: {
					text: "Buyer interest buffer should not leak",
				},
			});

			const collection = yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
			});

			const item = collection.find((l) => l.id === listingId);
			const fetched = yield* transactionListingFetchFx({
				scope: {
					userId: seller.id,
				},
				where: {
					id: listingId,
				},
			});

			const ids = collection.map((l) => l.id);
			expect(ids).toContain(listingId);
			expect(typeof item?.count).toBe("number");
			expect(item?.count).toBe(1);
			expect(item?.entry.kind).toBe("status-interest");
			expect(item?.lastAt.getTime()).toBe(
				new Date(item?.entry.createdAt ?? 0).getTime(),
			);
			expect(item?.lastAt.getTime()).toBeLessThan(hiddenTextEntry.createdAt.getTime());
			expect(fetched.entry.kind).toBe("status-interest");
			expect(fetched.lastAt.getTime()).toBe(new Date(fetched.entry.createdAt).getTime());
			expect(fetched.lastAt.getTime()).toBeLessThan(hiddenTextEntry.createdAt.getTime());
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});

	it("lastAt sorting ignores buffered buyer text across seller listings", async () => {
		const database = await testabase("txListing-lastAt-interest-buffer");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			const olderScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			const newerScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			const hiddenTextEntry = yield* transactionEntryCreateFx({
				userId: buyer.id,
				transactionId: olderScenario.transactionId,
				kind: "text",
				payload: {
					text: "This must not bubble the older listing",
				},
			});

			const collection = yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
				sort: [
					{
						field: "lastAt",
						order: "desc",
					},
				],
			});

			const orderedIds = collection.map((item) => item.id);
			const olderIndex = orderedIds.indexOf(olderScenario.listingId);
			const newerIndex = orderedIds.indexOf(newerScenario.listingId);
			const olderItem = collection.find((item) => item.id === olderScenario.listingId);

			expect(newerIndex).toBeGreaterThanOrEqual(0);
			expect(olderIndex).toBeGreaterThanOrEqual(0);
			expect(newerIndex).toBeLessThan(olderIndex);
			expect(olderItem?.entry.kind).toBe("status-interest");
			expect(olderItem?.lastAt.getTime()).toBeLessThan(hiddenTextEntry.createdAt.getTime());
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
