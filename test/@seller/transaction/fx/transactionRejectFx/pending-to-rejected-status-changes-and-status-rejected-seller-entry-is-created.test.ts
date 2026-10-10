import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionRejectFx } from "~/seller-transaction/fx/transactionRejectFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionRejectFx (seller)", () => {
	it("interest → rejected: status changes and status-rejected-seller entry is created", async () => {
		const database = await testabaseFn("sellerRejectFx-interest");

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

			const { status } = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("status")
					.where("id", "=", tx.id)
					.executeTakeFirstOrThrow(),
			);

			expect(status).toBe("rejected");

			const entries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select("kind")
					.where("transactionId", "=", tx.id)
					.execute(),
			);

			const kinds = entries.map((e) => e.kind);
			expect(kinds).toContain("status-interest");
			expect(kinds).toContain("status-rejected-seller");
			expect(kinds).not.toContain("status-rejected-buyer");
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
