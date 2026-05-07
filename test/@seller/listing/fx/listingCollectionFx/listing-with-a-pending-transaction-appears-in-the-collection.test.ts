import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/seller/listing/server/fx/listingCollectionFx";
import { listingFetchFx } from "~/seller/listing/server/fx/listingFetchFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";

describe("listingCollectionFx (seller dashboard transactions)", () => {
	it("listing with an interest transaction appears in the collection", async () => {
		const database = await testabase("listing-with-interest");

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

			const collection = yield* listingCollectionFx({
				userId: seller.id,
				scope: {
					userId: seller.id,
				},
				where: {
					withTransaction: true,
				},
			});

			const item = collection.find((listing) => listing.id === listingId);
			const fetched = yield* listingFetchFx({
				userId: seller.id,
				scope: {
					userId: seller.id,
				},
				where: {
					id: listingId,
				},
			});

			const ids = collection.map((listing) => listing.id);
			expect(ids).toContain(listingId);
			expect(typeof item?.withTransactionCount).toBe("number");
			expect(item?.withTransactionCount).toBe(1);
			expect(item?.withTransactionEntry?.kind).toBe("status-interest");
			expect(item?.withLastAt?.getTime()).toBe(
				new Date(item?.withTransactionEntry?.createdAt ?? 0).getTime(),
			);
			expect(item?.withLastAt?.getTime()).toBeLessThan(hiddenTextEntry.createdAt.getTime());
			expect(fetched.withTransactionEntry?.kind).toBe("status-interest");
			expect(fetched.withLastAt?.getTime()).toBe(
				new Date(fetched.withTransactionEntry?.createdAt ?? 0).getTime(),
			);
			expect(fetched.withLastAt?.getTime()).toBeLessThan(hiddenTextEntry.createdAt.getTime());
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});

	it("withLastAt sorting ignores buffered buyer text across seller listings", async () => {
		const database = await testabase("listing-lastAt-interest-buffer");

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

			const collection = yield* listingCollectionFx({
				userId: seller.id,
				scope: {
					userId: seller.id,
				},
				where: {
					withTransaction: true,
				},
				sort: [
					{
						field: "withLastAt",
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
			expect(olderItem?.withTransactionEntry?.kind).toBe("status-interest");
			expect(olderItem?.withLastAt?.getTime()).toBeLessThan(
				hiddenTextEntry.createdAt.getTime(),
			);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
