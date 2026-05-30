import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCollectionFx } from "~/seller/transaction/server/fx/transactionCollectionFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { getDefaultListingCreateFx } from "~/test/listing/fx/getDefaultListingCreateFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";

describe("seller transaction read model", () => {
	it("lastAt sorting ignores buffered buyer text while transaction stays in interest", async () => {
		const database = await testabase("sellerTransactionReadModelFx-lastAt-interest");

		return Effect.gen(function* () {
			const { seller, buyer } = yield* createUsersFx({});
			const listing = yield* getDefaultListingCreateFx;

			const olderScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				listing,
			});
			const newerScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				listing,
			});
			const hiddenTextEntry = yield* transactionEntryCreateFx({
				userId: buyer.id,
				transactionId: olderScenario.transactionId,
				kind: "text",
				payload: {
					text: "This must not make the older interest look newer",
				},
			});

			const collection = yield* transactionCollectionFx({
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
			const olderIndex = orderedIds.indexOf(olderScenario.transactionId);
			const newerIndex = orderedIds.indexOf(newerScenario.transactionId);
			const olderItem = collection.find((item) => item.id === olderScenario.transactionId);

			expect(newerIndex).toBeGreaterThanOrEqual(0);
			expect(olderIndex).toBeGreaterThanOrEqual(0);
			expect(newerIndex).toBeLessThan(olderIndex);
			expect(olderItem?.entry.kind).toBe("status-interest");
			expect(olderItem?.lastAt.getTime()).toBeLessThan(hiddenTextEntry.createdAt.getTime());
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
