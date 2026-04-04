import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionDisputeFx } from "~/buyer/transaction/server/fx/transactionDisputeFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createResolvedScenarioFx } from "~/test/transaction/fx/createResolvedScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionDisputeFx (buyer)", () => {
	it("resolved → dispute: status changes and status-dispute-buyer entry is created", async () => {
		const database = await testabase("buyerDisputeFx-resolved-to-dispute");

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

			const { status } = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("status")
					.where("id", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);

			expect(status).toBe("dispute");

			const entries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select("kind")
					.where("transactionId", "=", transactionId)
					.execute(),
			);

			const kinds = entries.map((e) => e.kind);
			expect(kinds).toContain("status-resolved");
			expect(kinds).toContain("status-dispute-buyer");
			expect(kinds).not.toContain("status-dispute-seller");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
