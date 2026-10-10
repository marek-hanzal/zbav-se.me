import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionDisputeFx } from "~/buyer-transaction/fx/transactionDisputeFx";
import { transactionResolveFx } from "~/seller-transaction/fx/transactionResolveFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createResolvedScenarioFx } from "~/test/transaction/fx/createResolvedScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionDisputeFx (buyer)", () => {
	it("dispute → resolved: seller re-resolves dispute and status-resolved entry is created", async () => {
		const database = await testabaseFn("buyerDisputeFx-dispute-to-resolved");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			const { transactionId } = yield* createResolvedScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			yield* transactionDisputeFx({
				transactionId,
				userId: buyer.id,
			});

			yield* transactionResolveFx({
				transactionId,
				userId: seller.id,
			});

			const { status } = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("status")
					.where("id", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);

			expect(status).toBe("resolved");

			const entries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select("kind")
					.where("transactionId", "=", transactionId)
					.orderBy("createdAt", "asc")
					.execute(),
			);

			const kinds = entries.map((e) => e.kind);
			expect(kinds).toContain("status-dispute-buyer");
			expect(kinds.filter((k) => k === "status-resolved")).toHaveLength(2);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
