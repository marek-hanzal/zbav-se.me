import { Effect } from "effect";
import { sql } from "kysely";
import { describe, expect, it } from "vitest";
import { transactionCloseFx } from "~/buyer/transaction/server/fx/transactionCloseFx";
import { transactionDisputeFx } from "~/buyer/transaction/server/fx/transactionDisputeFx";
import { transactionSuccessFx } from "~/buyer/transaction/server/fx/transactionSuccessFx";
import { auth } from "~/server/auth/auth";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";

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
			});

			const beforeEntries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select((eb) => eb.fn.countAll<number>().as("count"))
					.where("transactionId", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);
			const beforeInbox = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("inbox")
					.select((eb) => eb.fn.countAll<number>().as("count"))
					.where(sql<boolean>`reference @> ARRAY[${transactionId}]::text[]`)
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

			expectTaggedErrorFx(closeResult, {
				tag: "InvalidRequestErrorFx",
				message: "Invalid transaction status transition from open to closed for buyer",
			});
			expectTaggedErrorFx(successResult, {
				tag: "InvalidRequestErrorFx",
				message: "Invalid transaction status transition from open to success for buyer",
			});
			expectTaggedErrorFx(disputeResult, {
				tag: "InvalidRequestErrorFx",
				message: "Invalid transaction status transition from open to dispute for buyer",
			});

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
			const afterInbox = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("inbox")
					.select((eb) => eb.fn.countAll<number>().as("count"))
					.where(sql<boolean>`reference @> ARRAY[${transactionId}]::text[]`)
					.executeTakeFirstOrThrow(),
			);

			expect(afterTransaction.status).toBe("open");
			expect(afterEntries.count).toBe(beforeEntries.count);
			expect(afterInbox.count).toBe(beforeInbox.count);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
