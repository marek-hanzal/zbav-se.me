import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionSuccessFx } from "~/buyer/transaction/server/fx/transactionSuccessFx";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { transactionResolveFx } from "~/seller/transaction/server/fx/transactionResolveFx";
import { transactionListingCollectionFx } from "~/seller/transaction-listing/server/fx/transactionListingCollectionFx";
import { transactionListingCountFx } from "~/seller/transaction-listing/server/fx/transactionListingCountFx";
import { transactionListingFetchFx } from "~/seller/transaction-listing/server/fx/transactionListingFetchFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { getDefaultListingCreateFx } from "~/test/listing/fx/getDefaultListingCreateFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("seller transaction-listing read model", () => {
	it("filters by listing ids and terminal state inside seller scope", async () => {
		const database = await testabase("sellerTransactionListingReadModelFx-filters");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { seller, buyer } = yield* createUsersFx({
				api,
				slug: "seller-transaction-listing-filter",
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
			const terminalScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				listing,
			});
			yield* transactionAcceptFx({
				transactionId: openScenario.transactionId,
				userId: seller.id,
			});
			yield* transactionAcceptFx({
				transactionId: terminalScenario.transactionId,
				userId: seller.id,
			});
			yield* transactionResolveFx({
				transactionId: terminalScenario.transactionId,
				userId: seller.id,
			});
			yield* transactionSuccessFx({
				transactionId: terminalScenario.transactionId,
				userId: buyer.id,
			});

			const all = yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
			});
			const byId = yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					id: openScenario.listingId,
				},
			});
			const mixedIds = yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					idIn: [
						pendingScenario.listingId,
						openScenario.listingId,
					],
				},
			});
			const terminalOnly = yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					terminal: true,
				},
			});
			const nonTerminalCount = yield* transactionListingCountFx({
				scope: {
					userId: seller.id,
				},
				where: {
					terminal: false,
				},
			});
			const fetched = yield* transactionListingFetchFx({
				scope: {
					userId: seller.id,
				},
				where: {
					id: terminalScenario.listingId,
				},
			});
			expect(all.map((item) => item.id).sort()).toEqual(
				[
					pendingScenario.listingId,
					openScenario.listingId,
					terminalScenario.listingId,
				].sort(),
			);
			expect(byId).toHaveLength(1);
			expect(byId[0]?.id).toBe(openScenario.listingId);
			expect(mixedIds.map((item) => item.id).sort()).toEqual(
				[
					pendingScenario.listingId,
					openScenario.listingId,
				].sort(),
			);
			expect(terminalOnly).toHaveLength(1);
			expect(terminalOnly[0]?.id).toBe(terminalScenario.listingId);
			expect(nonTerminalCount.where).toBe(2);
			expect(fetched.id).toBe(terminalScenario.listingId);
			expect(typeof fetched.count).toBe("number");
			expect(typeof fetched.unreadCount).toBe("number");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});

	it("keeps foreign seller listings out", async () => {
		const database = await testabase("sellerTransactionListingReadModelFx-foreign");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { seller, buyer, stranger } = yield* createUsersFx({
				api,
				slug: "seller-transaction-listing-foreign",
			});
			const listing = yield* getDefaultListingCreateFx;

			const ownScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				listing,
			});
			const foreignScenario = yield* createPendingScenarioFx({
				sellerId: stranger.id,
				buyerId: buyer.id,
				listing,
			});

			const mixedIds = yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					idIn: [
						ownScenario.listingId,
						foreignScenario.listingId,
					],
				},
			});
			const foreignFetch = yield* Effect.either(
				transactionListingFetchFx({
					scope: {
						userId: seller.id,
					},
					where: {
						id: foreignScenario.listingId,
					},
				}),
			);

			expect(mixedIds).toHaveLength(1);
			expect(mixedIds[0]?.id).toBe(ownScenario.listingId);
			expect(foreignFetch._tag).toBe("Left");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
