import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCloseFx } from "~/buyer-transaction/fx/transactionCloseFx";
import { transactionDisputeFx } from "~/buyer-transaction/fx/transactionDisputeFx";
import { transactionRejectFx } from "~/buyer-transaction/fx/transactionRejectFx";
import { transactionSuccessFx } from "~/buyer-transaction/fx/transactionSuccessFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createResolvedScenarioFx } from "~/test/transaction/fx/createResolvedScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("buyer transaction invalid transitions", () => {
	it("rejects buyer actions once the transaction is already closed", async () => {
		const database = await testabaseFn("buyerTransactionFx-invalid-terminal-actions");

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
					.select((ebFn) => ebFn.fn.countAll<number>().as("count"))
					.where("transactionId", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);

			const rejectResult = yield* Effect.result(
				transactionRejectFx({
					transactionId,
					userId: buyer.id,
				}),
			);
			const disputeResult = yield* Effect.result(
				transactionDisputeFx({
					transactionId,
					userId: buyer.id,
				}),
			);
			const successResult = yield* Effect.result(
				transactionSuccessFx({
					transactionId,
					userId: buyer.id,
				}),
			);
			const closeAgainResult = yield* Effect.result(
				transactionCloseFx({
					transactionId,
					userId: buyer.id,
				}),
			);

			expectTaggedErrorFn(rejectResult, {
				tag: "InvalidRequestErrorFx",
				message: "Invalid transaction status transition from closed to rejected for buyer",
			});
			expectTaggedErrorFn(disputeResult, {
				tag: "InvalidRequestErrorFx",
				message: "Invalid transaction status transition from closed to dispute for buyer",
			});
			expectTaggedErrorFn(successResult, {
				tag: "InvalidRequestErrorFx",
				message: "Invalid transaction status transition from closed to success for buyer",
			});
			expectTaggedErrorFn(closeAgainResult, {
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
					.select((ebFn) => ebFn.fn.countAll<number>().as("count"))
					.where("transactionId", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);

			expect(transaction.status).toBe("closed");
			expect(afterEntries.count).toBe(beforeEntries.count);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
