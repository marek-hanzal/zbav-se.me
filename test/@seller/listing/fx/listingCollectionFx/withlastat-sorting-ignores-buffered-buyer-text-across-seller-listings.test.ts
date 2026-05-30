import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/seller/listing/server/fx/listingCollectionFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";

describe("listingCollectionFx (seller dashboard transactions)", () => {
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
