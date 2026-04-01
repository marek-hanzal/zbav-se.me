import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCollectionFx } from "~/buyer/transaction/server/fx/transactionCollectionFx";
import { transactionCountFx } from "~/buyer/transaction/server/fx/transactionCountFx";
import { transactionFetchFx } from "~/buyer/transaction/server/fx/transactionFetchFx";
import { transactionSuccessFx } from "~/buyer/transaction/server/fx/transactionSuccessFx";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { transactionResolveFx } from "~/seller/transaction/server/fx/transactionResolveFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/utils/createPendingScenarioFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("buyer transaction read model", () => {
	it("filters by where combinations and keeps foreign transactions out", async () => {
		const database = await testabase("buyerTransactionReadModelFx-filters");
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
				"buyer-transaction-filter-seller@test.cz",
				"Buyer Transaction Filter Seller",
			);
			const { user: buyer } = yield* signUp(
				"buyer-transaction-filter-buyer@test.cz",
				"Buyer Transaction Filter Buyer",
			);
			const { user: strangerSeller } = yield* signUp(
				"buyer-transaction-filter-stranger-seller@test.cz",
				"Buyer Transaction Filter Stranger Seller",
			);
			const { user: strangerBuyer } = yield* signUp(
				"buyer-transaction-filter-stranger-buyer@test.cz",
				"Buyer Transaction Filter Stranger Buyer",
			);

			const pendingScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			const openScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			const resolvedScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			const foreignScenario = yield* createPendingScenarioFx({
				sellerId: strangerSeller.id,
				buyerId: strangerBuyer.id,
			});

			const pendingTx = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", pendingScenario.listingId)
					.where("userId", "=", buyer.id)
					.executeTakeFirstOrThrow(),
			);
			const openTx = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", openScenario.listingId)
					.where("userId", "=", buyer.id)
					.executeTakeFirstOrThrow(),
			);
			const resolvedTx = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", resolvedScenario.listingId)
					.where("userId", "=", buyer.id)
					.executeTakeFirstOrThrow(),
			);
			const foreignTx = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", foreignScenario.listingId)
					.where("userId", "=", strangerBuyer.id)
					.executeTakeFirstOrThrow(),
			);

			yield* transactionAcceptFx({
				transactionId: openTx.id,
				userId: seller.id,
			});
			yield* transactionAcceptFx({
				transactionId: resolvedTx.id,
				userId: seller.id,
			});
			yield* transactionResolveFx({
				transactionId: resolvedTx.id,
				userId: seller.id,
			});
			yield* transactionSuccessFx({
				transactionId: resolvedTx.id,
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
			const mixedIds = yield* transactionCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					idIn: [
						openTx.id,
						foreignTx.id,
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
					id: openTx.id,
				},
			});
			const foreignFetch = yield* Effect.either(
				transactionFetchFx({
					scope: {
						userId: buyer.id,
					},
					where: {
						id: foreignTx.id,
					},
				}),
			);

			expect(all.map((item) => item.id).sort()).toEqual(
				[
					pendingTx.id,
					openTx.id,
					resolvedTx.id,
				].sort(),
			);
			expect(byListing).toHaveLength(1);
			expect(byListing[0]?.id).toBe(openTx.id);
			expect(openOnly).toHaveLength(1);
			expect(openOnly[0]?.id).toBe(openTx.id);
			expect(terminalOnly).toHaveLength(1);
			expect(terminalOnly[0]?.id).toBe(resolvedTx.id);
			expect(mixedIds).toHaveLength(1);
			expect(mixedIds[0]?.id).toBe(openTx.id);
			expect(resolvedCount.where).toBe(1);
			expect(fetched.id).toBe(openTx.id);
			expect(typeof fetched.unreadCount).toBe("number");
			expect(foreignFetch._tag).toBe("Left");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
