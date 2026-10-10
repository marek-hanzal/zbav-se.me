import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCloseFx } from "~/buyer-transaction/fx/transactionCloseFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createResolvedScenarioFx } from "~/test/transaction/fx/createResolvedScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionCloseFx (buyer)", () => {
	it("invalid: cannot close an already-closed transaction", async () => {
		const database = await testabaseFn("buyerCloseFx-double-close");

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

			const result = yield* Effect.result(
				transactionCloseFx({
					transactionId,
					userId: buyer.id,
				}),
			);

			expectTaggedErrorFn(result, {
				tag: "InvalidRequestErrorFx",
				message: "Invalid transaction status transition from closed to closed for buyer",
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
					.select((ebFn) => ebFn.fn.countAll<number>().as("count"))
					.where("transactionId", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);

			expect(afterTransaction.status).toBe("closed");
			expect(afterEntries.count).toBe(beforeEntries.count);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
