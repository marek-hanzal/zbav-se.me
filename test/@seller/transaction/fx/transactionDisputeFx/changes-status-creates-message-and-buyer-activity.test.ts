import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionDisputeFx } from "~/seller/transaction/server/fx/transactionDisputeFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createResolvedScenarioFx } from "~/test/transaction/fx/createResolvedScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("transactionDisputeFx (seller)", () => {
	it("changes status, creates seller dispute status message and buyer activity side effect", async () => {
		const database = await testabase("sellerTransactionDisputeFx-contract");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});

			const scenario = yield* createResolvedScenarioFx({
				sellerId: users.seller.id,
				buyerId: users.buyer.id,
			});

			yield* transactionDisputeFx({
				transactionId: scenario.transactionId,
				userId: users.seller.id,
			});

			const transaction = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("status")
					.where("id", "=", scenario.transactionId)
					.executeTakeFirstOrThrow(),
			);

			expect(transaction.status).toBe("dispute");

			const entries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select("kind")
					.where("transactionId", "=", scenario.transactionId)
					.execute(),
			);

			expect(entries.map((item) => item.kind)).toContain("status-dispute-seller");

			const activity = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("activity")
					.select([
						"userId",
						"type",
						"family",
						"priority",
					])
					.where("userId", "=", users.buyer.id)
					.where("family", "=", "transaction")
					.where("type", "=", "seller-message")
					.executeTakeFirstOrThrow(),
			);

			expect(activity.userId).toBe(users.buyer.id);
			expect(activity.family).toBe("transaction");
			expect(activity.type).toBe("seller-message");
			expect(activity.priority).toBe("high");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
