import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCollectionFx } from "~/seller/transaction/server/fx/transactionCollectionFx";
import { transactionCountFx } from "~/seller/transaction/server/fx/transactionCountFx";
import { transactionFetchFx } from "~/seller/transaction/server/fx/transactionFetchFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { getDefaultListingCreateFx } from "~/test/listing/fx/getDefaultListingCreateFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";

describe("seller transaction read model", () => {
	it("collection, fetch and count respect seller scope and expose unreadCount", async () => {
		const database = await testabase("sellerTransactionReadModelFx");

		return Effect.gen(function* () {
			const { seller, buyer, stranger } = yield* createUsersFx({});
			const listing = yield* getDefaultListingCreateFx;

			const ownScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				listing,
			});
			const hiddenTextEntry = yield* transactionEntryCreateFx({
				userId: buyer.id,
				transactionId: ownScenario.transactionId,
				kind: "text",
				payload: {
					text: "Buyer interest buffer should not leak",
				},
			});
			yield* createPendingScenarioFx({
				sellerId: stranger.id,
				buyerId: buyer.id,
				listing,
			});

			const collection = yield* transactionCollectionFx({
				scope: {
					userId: seller.id,
				},
			});

			expect(collection).toHaveLength(1);
			expect(collection[0]?.id).toBe(ownScenario.transactionId);
			expect(typeof collection[0]?.unread).toBe("number");
			expect(collection[0]?.unread).toBe(1);
			expect(collection[0]?.entry.kind).toBe("status-interest");
			expect(collection[0]?.lastAt.getTime()).toBe(
				new Date(collection[0]?.entry.createdAt ?? 0).getTime(),
			);
			expect(collection[0]?.lastAt.getTime()).toBeLessThan(
				hiddenTextEntry.createdAt.getTime(),
			);

			const fetched = yield* transactionFetchFx({
				scope: {
					userId: seller.id,
				},
				where: {
					id: ownScenario.transactionId,
				},
			});

			expect(fetched.id).toBe(ownScenario.transactionId);
			expect(typeof fetched.unread).toBe("number");
			expect(fetched.unread).toBe(1);
			expect(fetched.entry.kind).toBe("status-interest");
			expect(fetched.lastAt.getTime()).toBe(new Date(fetched.entry.createdAt).getTime());
			expect(fetched.lastAt.getTime()).toBeLessThan(hiddenTextEntry.createdAt.getTime());

			const count = yield* transactionCountFx({
				scope: {
					userId: seller.id,
				},
			});

			expect(count).toBe(1);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
