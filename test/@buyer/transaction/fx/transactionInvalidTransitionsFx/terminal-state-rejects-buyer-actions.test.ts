import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCloseFx } from "~/buyer/transaction/server/fx/transactionCloseFx";
import { transactionDisputeFx } from "~/buyer/transaction/server/fx/transactionDisputeFx";
import { transactionRejectFx } from "~/buyer/transaction/server/fx/transactionRejectFx";
import { transactionSuccessFx } from "~/buyer/transaction/server/fx/transactionSuccessFx";
import { auth } from "~/server/auth/auth";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createResolvedScenarioFx } from "~/test/transaction/fx/createResolvedScenarioFx";

describe("buyer transaction invalid transitions", () => {
	it("rejects buyer actions once the transaction is already closed", async () => {
		const database = await testabase("buyerTransactionFx-invalid-terminal-actions");
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
				"seller-buyer-terminal-invalid@test.cz",
				"Seller Buyer Terminal Invalid",
			);
			const { user: buyer } = yield* signUp(
				"buyer-buyer-terminal-invalid@test.cz",
				"Buyer Buyer Terminal Invalid",
			);

			const { transactionId } = yield* createResolvedScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			yield* transactionCloseFx({
				transactionId,
				userId: buyer.id,
			});
			const beforeEntries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select((eb) => eb.fn.countAll<number>().as("count"))
					.where("transactionId", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);

			const rejectResult = yield* Effect.either(
				transactionRejectFx({
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
			const successResult = yield* Effect.either(
				transactionSuccessFx({
					transactionId,
					userId: buyer.id,
				}),
			);
			const closeAgainResult = yield* Effect.either(
				transactionCloseFx({
					transactionId,
					userId: buyer.id,
				}),
			);

			expectTaggedErrorFx(rejectResult, {
				tag: "InvalidRequestErrorFx",
				message: "Invalid transaction status transition from closed to rejected for buyer",
			});
			expectTaggedErrorFx(disputeResult, {
				tag: "InvalidRequestErrorFx",
				message: "Invalid transaction status transition from closed to dispute for buyer",
			});
			expectTaggedErrorFx(successResult, {
				tag: "InvalidRequestErrorFx",
				message: "Invalid transaction status transition from closed to success for buyer",
			});
			expectTaggedErrorFx(closeAgainResult, {
				tag: "InvalidRequestErrorFx",
				message: "Invalid transaction status transition from closed to closed for buyer",
			});

			const transaction = yield* Effect.promise(() =>
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

			expect(transaction.status).toBe("closed");
			expect(afterEntries.count).toBe(beforeEntries.count);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
