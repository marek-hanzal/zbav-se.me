import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCloseFx } from "~/buyer/transaction/server/fx/transactionCloseFx";
import { transactionDisputeFx } from "~/buyer/transaction/server/fx/transactionDisputeFx";
import { transactionRejectFx } from "~/buyer/transaction/server/fx/transactionRejectFx";
import { transactionSuccessFx } from "~/buyer/transaction/server/fx/transactionSuccessFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createResolvedScenarioFx } from "~/test/transaction/fx/createResolvedScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("buyer transaction invalid transitions", () => {
	it("rejects buyer actions once the transaction is already closed", async () => {
		const database = await testabase("buyerTransactionFx-invalid-terminal-actions");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

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
