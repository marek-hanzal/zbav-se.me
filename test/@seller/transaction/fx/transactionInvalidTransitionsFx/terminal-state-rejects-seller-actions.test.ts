import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionSuccessFx } from "~/buyer-transaction/fx/transactionSuccessFx";
import { transactionAcceptFx } from "~/seller-transaction/fx/transactionAcceptFx";
import { transactionRejectFx } from "~/seller-transaction/fx/transactionRejectFx";
import { transactionResolveFx } from "~/seller-transaction/fx/transactionResolveFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createResolvedScenarioFx } from "~/test/transaction/fx/createResolvedScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("seller transaction invalid transitions", () => {
	it("rejects seller actions once the transaction is terminal", async () => {
		const database = await testabaseFn("sellerTransactionFx-invalid-terminal-actions");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			const { transactionId } = yield* createResolvedScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			yield* transactionSuccessFx({
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

			const acceptResult = yield* Effect.result(
				transactionAcceptFx({
					transactionId,
					userId: seller.id,
				}),
			);
			const rejectResult = yield* Effect.result(
				transactionRejectFx({
					transactionId,
					userId: seller.id,
				}),
			);
			const resolveResult = yield* Effect.result(
				transactionResolveFx({
					transactionId,
					userId: seller.id,
				}),
			);

			expectTaggedErrorFn(acceptResult, {
				tag: "InvalidRequestErrorFx",
				message: "Invalid transaction status transition from success to trade for seller",
			});
			expectTaggedErrorFn(rejectResult, {
				tag: "InvalidRequestErrorFx",
				message:
					"Invalid transaction status transition from success to rejected for seller",
			});
			expectTaggedErrorFn(resolveResult, {
				tag: "InvalidRequestErrorFx",
				message:
					"Invalid transaction status transition from success to resolved for seller",
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

			expect(transaction.status).toBe("success");
			expect(afterEntries.count).toBe(beforeEntries.count);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
