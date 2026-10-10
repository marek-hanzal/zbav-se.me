import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { transactionStatusMessageFx } from "~/user-transaction/fx/transactionStatusMessageFx";

describe("transactionStatusMessageFx", () => {
	it("ignores unmapped request and target combinations", async () => {
		const database = await testabaseFn("transactionStatusMessageFx-noop");

		return Effect.gen(function* () {
			const { seller, buyer } = yield* createUsersFx({});

			const { listingId } = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const transaction = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", listingId)
					.where("userId", "=", buyer.id)
					.executeTakeFirstOrThrow(),
			);

			const beforeCount = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select((ebFn) => ebFn.fn.countAll<number>().as("count"))
					.where("transactionId", "=", transaction.id)
					.executeTakeFirstOrThrow(),
			);

			yield* transactionStatusMessageFx({
				transactionId: transaction.id,
				request: "trade",
				target: "buyer",
				userId: buyer.id,
			});
			yield* transactionStatusMessageFx({
				transactionId: transaction.id,
				request: "resolved",
				target: "buyer",
				userId: buyer.id,
			});

			const afterCount = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select((ebFn) => ebFn.fn.countAll<number>().as("count"))
					.where("transactionId", "=", transaction.id)
					.executeTakeFirstOrThrow(),
			);

			expect(afterCount.count).toBe(beforeCount.count);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
