import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCollectionFx } from "~/buyer/transaction/server/fx/transactionCollectionFx";
import { transactionCountFx } from "~/buyer/transaction/server/fx/transactionCountFx";
import { transactionFetchFx } from "~/buyer/transaction/server/fx/transactionFetchFx";
import { transactionSuccessFx } from "~/buyer/transaction/server/fx/transactionSuccessFx";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { transactionResolveFx } from "~/seller/transaction/server/fx/transactionResolveFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { getDefaultListingCreateFx } from "~/test/listing/fx/getDefaultListingCreateFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { createDbUserFx } from "~/test/user/fx/createDbUserFx";

describe("buyer transaction read model", () => {
	it("filters collection rows by status, terminal and listing inside buyer scope", async () => {
		const database = await testabase("buyerTransactionReadModelFx-filters-collection");

		return Effect.gen(function* () {
			const seller = yield* createDbUserFx({
				email: "seller-buyer-transaction-filter@test.cz",
				name: "Seller Buyer Transaction Filter",
			});
			const buyer = yield* createDbUserFx({
				email: "buyer-buyer-transaction-filter@test.cz",
				name: "Buyer Buyer Transaction Filter",
			});
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
					status: "open",
				},
			});
			const terminalOnly = yield* transactionCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					terminal: true,
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

	it("filters fetch and count by ids inside buyer scope", async () => {
		const database = await testabase("buyerTransactionReadModelFx-filters-fetch-count");

		return Effect.gen(function* () {
			const seller = yield* createDbUserFx({
				email: "seller-buyer-transaction-fetch@test.cz",
				name: "Seller Buyer Transaction Fetch",
			});
			const buyer = yield* createDbUserFx({
				email: "buyer-buyer-transaction-fetch@test.cz",
				name: "Buyer Buyer Transaction Fetch",
			});
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
					userId: buyer.id,
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
					userId: buyer.id,
				},
				where: {
					status: "success",
				},
			});
			const fetched = yield* transactionFetchFx({
				scope: {
					userId: buyer.id,
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
			expect(resolvedCount.where).toBe(0);
			expect(fetched.id).toBe(openScenario.transactionId);
			expect(typeof fetched.unreadCount).toBe("number");
			expect(fetched.status).toBe("open");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});

	it("keeps foreign buyer transactions out", async () => {
		const database = await testabase("buyerTransactionReadModelFx-foreign");

		return Effect.gen(function* () {
			const seller = yield* createDbUserFx({
				email: "seller-buyer-transaction-foreign@test.cz",
				name: "Seller Buyer Transaction Foreign",
			});
			const buyer = yield* createDbUserFx({
				email: "buyer-buyer-transaction-foreign@test.cz",
				name: "Buyer Buyer Transaction Foreign",
			});
			const stranger = yield* createDbUserFx({
				email: "stranger-buyer-transaction-foreign@test.cz",
				name: "Stranger Buyer Transaction Foreign",
			});
			const listing = yield* getDefaultListingCreateFx;

			const ownScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				listing,
			});
			const foreignScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: stranger.id,
				listing,
			});

			const mixedIds = yield* transactionCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					idIn: [
						ownScenario.transactionId,
						foreignScenario.transactionId,
					],
				},
			});
			const foreignFetch = yield* Effect.either(
				transactionFetchFx({
					scope: {
						userId: buyer.id,
					},
					where: {
						id: foreignScenario.transactionId,
					},
				}),
			);

			expect(mixedIds).toHaveLength(1);
			expect(mixedIds[0]?.id).toBe(ownScenario.transactionId);
			expect(foreignFetch._tag).toBe("Left");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
