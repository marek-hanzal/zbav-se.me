import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionSuccessFx } from "~/buyer-transaction/fx/transactionSuccessFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createResolvedScenarioFx } from "~/test/transaction/fx/createResolvedScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionSuccessFx (buyer)", () => {
	it("invalid: seller cannot confirm success", async () => {
		const database = await testabaseFn("buyerSuccessFx-seller-cannot-confirm");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			const { transactionId } = yield* createResolvedScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			const beforeEntries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select((ebFn) => ebFn.fn.countAll<number>().as("count"))
					.where("transactionId", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);

			const result = yield* Effect.result(
				transactionSuccessFx({
					transactionId,
					userId: seller.id,
				}),
			);

			expectTaggedErrorFn(result, {
				tag: "NotFoundErrorFx",
				message: "Resource not found",
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

			expect(afterTransaction.status).toBe("resolved");
			expect(afterEntries.count).toBe(beforeEntries.count);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
