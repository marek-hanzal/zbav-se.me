import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCollectionFx } from "~/seller/transaction/server/fx/transactionCollectionFx";
import { transactionCountFx } from "~/seller/transaction/server/fx/transactionCountFx";
import { transactionFetchFx } from "~/seller/transaction/server/fx/transactionFetchFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";

describe("seller transaction read model", () => {
	it("collection, fetch and count respect seller scope and expose unreadCount", async () => {
		const database = await testabase("sellerTransactionReadModelFx");
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
				"seller-transaction-read@test.cz",
				"Seller Transaction Read",
			);
			const { user: buyer } = yield* signUp(
				"buyer-transaction-read@test.cz",
				"Buyer Transaction Read",
			);
			const { user: strangerSeller } = yield* signUp(
				"stranger-seller-transaction-read@test.cz",
				"Stranger Seller Transaction Read",
			);
			const { user: strangerBuyer } = yield* signUp(
				"stranger-buyer-transaction-read@test.cz",
				"Stranger Buyer Transaction Read",
			);

			const ownScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			yield* createPendingScenarioFx({
				sellerId: strangerSeller.id,
				buyerId: strangerBuyer.id,
			});

			const ownTransaction = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", ownScenario.listingId)
					.where("userId", "=", buyer.id)
					.executeTakeFirstOrThrow(),
			);

			const collection = yield* transactionCollectionFx({
				scope: {
					userId: seller.id,
				},
			});

			expect(collection).toHaveLength(1);
			expect(collection[0]?.id).toBe(ownTransaction.id);
			expect(typeof collection[0]?.unreadCount).toBe("number");
			expect(collection[0]?.unreadCount).toBeGreaterThan(0);

			const fetched = yield* transactionFetchFx({
				scope: {
					userId: seller.id,
				},
				where: {
					id: ownTransaction.id,
				},
			});

			expect(fetched.id).toBe(ownTransaction.id);
			expect(typeof fetched.unreadCount).toBe("number");

			const count = yield* transactionCountFx({
				scope: {
					userId: seller.id,
				},
			});

			expect(count.total).toBe(1);
			expect(count.where).toBe(1);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
