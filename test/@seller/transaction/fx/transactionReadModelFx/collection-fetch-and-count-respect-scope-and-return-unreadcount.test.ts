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
			expect(typeof collection[0]?.unreadCount).toBe("number");
			expect(collection[0]?.unreadCount).toBeGreaterThan(0);

			const fetched = yield* transactionFetchFx({
				scope: {
					userId: seller.id,
				},
				where: {
					id: ownScenario.transactionId,
				},
			});

			expect(fetched.id).toBe(ownScenario.transactionId);
			expect(typeof fetched.unreadCount).toBe("number");

			const count = yield* transactionCountFx({
				scope: {
					userId: seller.id,
				},
			});

			expect(count).toBe(1);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
