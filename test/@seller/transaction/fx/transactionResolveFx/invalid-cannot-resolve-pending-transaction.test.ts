import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionResolveFx } from "~/seller/transaction/server/fx/transactionResolveFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";

describe("transactionResolveFx", () => {
	it("invalid: cannot resolve a pending transaction", async () => {
		const database = await testabase("sellerResolveFx-invalid-pending");
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
				"seller-resolve-invalid-pending@test.cz",
				"Seller Resolve Invalid Pending",
			);
			const { user: buyer } = yield* signUp(
				"buyer-resolve-invalid-pending@test.cz",
				"Buyer Resolve Invalid Pending",
			);

			const { listingId } = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const transaction = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select([
						"id",
						"status",
					])
					.where("listingId", "=", listingId)
					.where("userId", "=", buyer.id)
					.executeTakeFirstOrThrow(),
			);

			const beforeEntries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select((eb) => eb.fn.countAll<number>().as("count"))
					.where("transactionId", "=", transaction.id)
					.executeTakeFirstOrThrow(),
			);

			const result = yield* Effect.either(
				transactionResolveFx({
					transactionId: transaction.id,
					userId: seller.id,
				}),
			);

			expect(result._tag).toBe("Left");

			const afterTransaction = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("status")
					.where("id", "=", transaction.id)
					.executeTakeFirstOrThrow(),
			);
			const afterEntries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select((eb) => eb.fn.countAll<number>().as("count"))
					.where("transactionId", "=", transaction.id)
					.executeTakeFirstOrThrow(),
			);

			expect(afterTransaction.status).toBe("pending");
			expect(Number(afterEntries.count)).toBe(Number(beforeEntries.count));
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
