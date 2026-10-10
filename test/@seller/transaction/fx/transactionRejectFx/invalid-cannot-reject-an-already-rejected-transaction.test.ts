import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionRejectFx } from "~/seller-transaction/fx/transactionRejectFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionRejectFx (seller)", () => {
	it("invalid: cannot reject an already-rejected transaction", async () => {
		const database = await testabaseFn("sellerRejectFx-double-reject");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const tx = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("userId", "=", buyer.id)
					.executeTakeFirstOrThrow(),
			);

			yield* transactionRejectFx({
				transactionId: tx.id,
				userId: seller.id,
			});
			const beforeEntries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select((ebFn) => ebFn.fn.countAll<number>().as("count"))
					.where("transactionId", "=", tx.id)
					.executeTakeFirstOrThrow(),
			);

			const result = yield* Effect.result(
				transactionRejectFx({
					transactionId: tx.id,
					userId: seller.id,
				}),
			);

			expectTaggedErrorFn(result, {
				tag: "InvalidRequestErrorFx",
				message:
					"Invalid transaction status transition from rejected to rejected for seller",
			});

			const afterTransaction = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("status")
					.where("id", "=", tx.id)
					.executeTakeFirstOrThrow(),
			);
			const afterEntries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select((ebFn) => ebFn.fn.countAll<number>().as("count"))
					.where("transactionId", "=", tx.id)
					.executeTakeFirstOrThrow(),
			);

			expect(afterTransaction.status).toBe("rejected");
			expect(afterEntries.count).toBe(beforeEntries.count);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
