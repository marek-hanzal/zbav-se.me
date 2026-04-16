import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionRejectFx } from "~/buyer/transaction/server/fx/transactionRejectFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionRejectFx (buyer)", () => {
	it("interest → rejected: status changes and status-rejected-buyer entry is created", async () => {
		const database = await testabase("buyerRejectFx-interest");

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
				userId: buyer.id,
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
			expect(kinds).toContain("status-rejected-buyer");
			expect(kinds).not.toContain("status-rejected-seller");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
