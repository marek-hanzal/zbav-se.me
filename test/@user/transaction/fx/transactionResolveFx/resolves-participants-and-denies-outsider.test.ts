import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { expectErrorFn } from "~/test/common/fx/expectErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { transactionResolveFx } from "~/user-transaction/fx/transactionResolveFx";

describe("transactionResolveFx", () => {
	it("resolves buyer and seller access and denies outsider", async () => {
		const database = await testabaseFn("transactionResolveFx-access-resolver");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});

			const scenario = yield* createPendingScenarioFx({
				sellerId: users.seller.id,
				buyerId: users.buyer.id,
			});

			const transaction = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", scenario.listingId)
					.executeTakeFirstOrThrow(),
			);

			const buyerResolved = yield* transactionResolveFx({
				userId: users.buyer.id,
				transactionId: transaction.id,
			});
			expect(buyerResolved.buyerId).toBe(users.buyer.id);
			expect(buyerResolved.sellerId).toBe(users.seller.id);

			const sellerResolved = yield* transactionResolveFx({
				userId: users.seller.id,
				transactionId: transaction.id,
			});
			expect(sellerResolved.buyerId).toBe(users.buyer.id);
			expect(sellerResolved.sellerId).toBe(users.seller.id);

			const outsider = yield* Effect.result(
				transactionResolveFx({
					userId: users.stranger.id,
					transactionId: transaction.id,
				}),
			);
			expectErrorFn(outsider);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
