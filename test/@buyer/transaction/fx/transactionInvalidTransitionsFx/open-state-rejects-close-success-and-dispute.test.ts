import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCloseFx } from "~/buyer/transaction/server/fx/transactionCloseFx";
import { transactionDisputeFx } from "~/buyer/transaction/server/fx/transactionDisputeFx";
import { transactionSuccessFx } from "~/buyer/transaction/server/fx/transactionSuccessFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/utils/createOpenScenarioFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("buyer transaction invalid transitions", () => {
	it("rejects close, success and dispute while the transaction is still open", async () => {
		const database = await testabase("buyerTransactionFx-invalid-open-transitions");
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
				"seller-invalid-open-transitions@test.cz",
				"Seller Invalid Open Transitions",
			);
			const { user: buyer } = yield* signUp(
				"buyer-invalid-open-transitions@test.cz",
				"Buyer Invalid Open Transitions",
			);

			const { transactionId } = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				database,
			});

			const beforeEntries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select((eb) => eb.fn.countAll<number>().as("count"))
					.where("transactionId", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);

			const closeResult = yield* Effect.either(
				transactionCloseFx({
					transactionId,
					userId: buyer.id,
				}),
			);
			const successResult = yield* Effect.either(
				transactionSuccessFx({
					transactionId,
					userId: buyer.id,
				}),
			);
			const disputeResult = yield* Effect.either(
				transactionDisputeFx({
					transactionId,
					userId: buyer.id,
				}),
			);

			expect(closeResult._tag).toBe("Left");
			expect(successResult._tag).toBe("Left");
			expect(disputeResult._tag).toBe("Left");

			const afterTransaction = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("status")
					.where("id", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);
			const afterEntries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select((eb) => eb.fn.countAll<number>().as("count"))
					.where("transactionId", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);

			expect(afterTransaction.status).toBe("open");
			expect(Number(afterEntries.count)).toBe(Number(beforeEntries.count));
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
