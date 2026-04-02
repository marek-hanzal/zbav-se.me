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
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";

describe("seller transaction-listing read model", () => {
	it("filters by listing ids and terminal state while isolating foreign seller listings", async () => {
		const database = await testabase("sellerTransactionListingReadModelFx-filters");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const signUp = (email: string, name: string) =>
				Effect.promise(() =>
					api.signUpEmail({
						body: {
							email,
							name,
							password: "12345678",
						},
					}),
				);

			const { user: seller } = yield* signUp(
				"seller-transaction-listing-filter-seller@test.cz",
				"Seller Transaction Listing Filter Seller",
			);
			const { user: buyer } = yield* signUp(
				"seller-transaction-listing-filter-buyer@test.cz",
				"Seller Transaction Listing Filter Buyer",
			);
			const { user: strangerSeller } = yield* signUp(
				"seller-transaction-listing-filter-stranger-seller@test.cz",
				"Seller Transaction Listing Filter Stranger Seller",
			);
			const { user: strangerBuyer } = yield* signUp(
				"seller-transaction-listing-filter-stranger-buyer@test.cz",
				"Seller Transaction Listing Filter Stranger Buyer",
			);

			const pendingScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			const openScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			const terminalScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			const foreignScenario = yield* createPendingScenarioFx({
				sellerId: strangerSeller.id,
				buyerId: strangerBuyer.id,
			});

			const openTx = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", openScenario.listingId)
					.executeTakeFirstOrThrow(),
			);
			const terminalTx = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", terminalScenario.listingId)
					.executeTakeFirstOrThrow(),
			);

			yield* transactionAcceptFx({
				transactionId: openTx.id,
				userId: seller.id,
			});
			yield* transactionAcceptFx({
				transactionId: terminalTx.id,
				userId: seller.id,
			});
			yield* transactionResolveFx({
				transactionId: terminalTx.id,
				userId: seller.id,
			});
			yield* transactionSuccessFx({
				transactionId: terminalTx.id,
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
						foreignScenario.listingId,
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

			expect(all.map((item) => item.id).sort()).toEqual(
				[
					pendingScenario.listingId,
					openScenario.listingId,
					terminalScenario.listingId,
				].sort(),
			);
			expect(byId).toHaveLength(1);
			expect(byId[0]?.id).toBe(openScenario.listingId);
			expect(mixedIds).toHaveLength(1);
			expect(mixedIds[0]?.id).toBe(pendingScenario.listingId);
			expect(terminalOnly).toHaveLength(1);
			expect(terminalOnly[0]?.id).toBe(terminalScenario.listingId);
			expect(nonTerminalCount.where).toBe(2);
			expect(fetched.id).toBe(terminalScenario.listingId);
			expect(typeof fetched.count).toBe("number");
			expect(typeof fetched.unreadCount).toBe("number");
			expect(foreignFetch._tag).toBe("Left");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
