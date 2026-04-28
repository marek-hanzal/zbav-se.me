import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { transactionCollectionFx } from "~/seller/transaction/server/fx/transactionCollectionFx";
import { transactionCountFx } from "~/seller/transaction/server/fx/transactionCountFx";
import { transactionFetchFx } from "~/seller/transaction/server/fx/transactionFetchFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { getDefaultListingCreateFx } from "~/test/listing/fx/getDefaultListingCreateFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("seller transaction read model fetch and count", () => {
	it("filters fetch and count by ids inside seller scope", async () => {
		const database = await testabase("sellerTransactionReadModelFx-filters-fetch-count");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});
			const listing = yield* getDefaultListingCreateFx;

			const pendingScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				listing,
			});
			const openScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				listing,
			});
			yield* transactionAcceptFx({
				transactionId: openScenario.transactionId,
				userId: seller.id,
			});

			const mixedIds = yield* transactionCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					idIn: [
						pendingScenario.transactionId,
						openScenario.transactionId,
					],
				},
			});
			const resolvedCount = yield* transactionCountFx({
				scope: {
					userId: seller.id,
				},
				where: {
					status: "success",
				},
			});
			const fetched = yield* transactionFetchFx({
				scope: {
					userId: seller.id,
				},
				where: {
					id: openScenario.transactionId,
				},
			});

			expect(mixedIds.map((item) => item.id).sort()).toEqual(
				[
					pendingScenario.transactionId,
					openScenario.transactionId,
				].sort(),
			);
			expect(resolvedCount).toBe(0);
			expect(fetched.id).toBe(openScenario.transactionId);
			// expect(typeof fetched.unreadCount).toBe("number");
			expect(fetched.status).toBe("trade");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
