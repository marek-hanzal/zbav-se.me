import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionAcceptFx } from "~/seller-transaction/fx/transactionAcceptFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionAcceptFx", () => {
	it("invalid: buyer cannot accept their own transaction", async () => {
		const database = await testabaseFn("transactionAcceptFx-buyer-cannot-accept");

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
					.select([
						"id",
						"status",
					])
					.where("userId", "=", buyer.id)
					.executeTakeFirstOrThrow(),
			);
			const beforeEntries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select((ebFn) => ebFn.fn.countAll<number>().as("count"))
					.where("transactionId", "=", tx.id)
					.executeTakeFirstOrThrow(),
			);

			const result = yield* Effect.result(
				transactionAcceptFx({
					transactionId: tx.id,
					userId: buyer.id,
				}),
			);

			expectTaggedErrorFn(result, {
				tag: "InvalidRequestErrorFx",
				message: "Buyer cannot accept their own transaction",
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

			expect(afterTransaction.status).toBe(tx.status);
			expect(afterEntries.count).toBe(beforeEntries.count);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
