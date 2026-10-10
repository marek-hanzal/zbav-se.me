import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionSuccessFx } from "~/buyer-transaction/fx/transactionSuccessFx";
import { transactionAcceptFx } from "~/seller-transaction/fx/transactionAcceptFx";
import { transactionCollectionFx } from "~/seller-transaction/fx/transactionCollectionFx";
import { transactionResolveFx } from "~/seller-transaction/fx/transactionResolveFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { getDefaultListingCreateFx } from "~/test/listing/fx/getDefaultListingCreateFx";
import { testabaseFn } from "~/test/testabaseFn";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("seller transaction read model collection filters", () => {
	it("filters collection rows by status and listing inside seller scope", async () => {
		const database = await testabaseFn("sellerTransactionReadModelFx-filters-collection");

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
			const resolvedScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				listing,
			});
			yield* transactionAcceptFx({
				transactionId: openScenario.transactionId,
				userId: seller.id,
			});
			yield* transactionAcceptFx({
				transactionId: resolvedScenario.transactionId,
				userId: seller.id,
			});
			yield* transactionResolveFx({
				transactionId: resolvedScenario.transactionId,
				userId: seller.id,
			});
			yield* transactionSuccessFx({
				transactionId: resolvedScenario.transactionId,
				userId: buyer.id,
			});

			const all = yield* transactionCollectionFx({
				scope: {
					userId: seller.id,
				},
			});
			const byListing = yield* transactionCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					listingId: openScenario.listingId,
				},
			});
			const openOnly = yield* transactionCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					status: "trade",
				},
			});

			expect(all.map((item) => item.id).sort()).toEqual(
				[
					pendingScenario.transactionId,
					openScenario.transactionId,
					resolvedScenario.transactionId,
				].sort(),
			);
			expect(byListing).toHaveLength(1);
			expect(byListing[0]?.id).toBe(openScenario.transactionId);
			expect(openOnly).toHaveLength(1);
			expect(openOnly[0]?.id).toBe(openScenario.transactionId);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
