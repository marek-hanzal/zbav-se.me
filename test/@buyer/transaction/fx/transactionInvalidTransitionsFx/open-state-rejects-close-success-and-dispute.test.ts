import { Effect } from "effect";
import { sql } from "kysely";
import { describe, expect, it } from "vitest";
import { transactionCloseFx } from "~/buyer/transaction/server/fx/transactionCloseFx";
import { transactionDisputeFx } from "~/buyer/transaction/server/fx/transactionDisputeFx";
import { transactionSuccessFx } from "~/buyer/transaction/server/fx/transactionSuccessFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("buyer transaction invalid transitions", () => {
	it("rejects close, success and dispute while the transaction is still open", async () => {
		const database = await testabase("buyerTransactionFx-invalid-open-transitions");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

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
			const beforeActivity = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("activity")
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
				message: "Invalid transaction status transition from trade to closed for buyer",
			});
			expectTaggedErrorFx(successResult, {
				tag: "InvalidRequestErrorFx",
				message: "Invalid transaction status transition from trade to success for buyer",
			});
			expectTaggedErrorFx(disputeResult, {
				tag: "InvalidRequestErrorFx",
				message: "Invalid transaction status transition from trade to dispute for buyer",
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
			const afterActivity = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("activity")
					.select((eb) => eb.fn.countAll<number>().as("count"))
					.where(sql<boolean>`reference @> ARRAY[${transactionId}]::text[]`)
					.executeTakeFirstOrThrow(),
			);

			expect(afterTransaction.status).toBe("trade");
			expect(afterEntries.count).toBe(beforeEntries.count);
			expect(afterActivity.count).toBe(beforeActivity.count);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
