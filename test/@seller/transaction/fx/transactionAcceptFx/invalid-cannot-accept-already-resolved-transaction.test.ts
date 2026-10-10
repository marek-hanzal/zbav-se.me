import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionAcceptFx } from "~/seller-transaction/fx/transactionAcceptFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createResolvedScenarioFx } from "~/test/transaction/fx/createResolvedScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionAcceptFx", () => {
	it("invalid: cannot accept an already resolved transaction", async () => {
		const database = await testabaseFn("transactionAcceptFx-invalid-resolved");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			const { transactionId } = yield* createResolvedScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const result = yield* Effect.result(
				transactionAcceptFx({
					transactionId,
					userId: seller.id,
				}),
			);

			expectTaggedErrorFn(result, {
				tag: "InvalidRequestErrorFx",
				message: "Invalid transaction status transition from resolved to trade for seller",
			});

			const transaction = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("status")
					.where("id", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);
			const entries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select("kind")
					.where("transactionId", "=", transactionId)
					.orderBy("createdAt", "asc")
					.execute(),
			);

			expect(transaction.status).toBe("resolved");
			expect(entries.at(-1)?.kind).toBe("status-resolved");
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
