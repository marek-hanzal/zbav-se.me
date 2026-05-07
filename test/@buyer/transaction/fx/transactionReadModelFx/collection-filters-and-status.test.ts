import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCollectionFx } from "~/buyer/transaction/server/fx/transactionCollectionFx";
import { transactionSuccessFx } from "~/buyer/transaction/server/fx/transactionSuccessFx";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { transactionResolveFx } from "~/seller/transaction/server/fx/transactionResolveFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { getDefaultListingCreateFx } from "~/test/listing/fx/getDefaultListingCreateFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("buyer transaction read model collection filters", () => {
	it("filters collection rows by status, flow and listing inside buyer scope", async () => {
		const database = await testabase("buyerTransactionReadModelFx-filters-collection");

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
					userId: buyer.id,
				},
			});
			const byListing = yield* transactionCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					listingId: openScenario.listingId,
				},
			});
			const openOnly = yield* transactionCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					status: "trade",
				},
			});
			const terminalOnly = yield* transactionCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					flow: "archived",
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
			expect(terminalOnly).toHaveLength(1);
			expect(terminalOnly[0]?.id).toBe(resolvedScenario.transactionId);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
