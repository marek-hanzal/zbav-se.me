import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionRejectFx } from "~/buyer/transaction/server/fx/transactionRejectFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionRejectFx (buyer)", () => {
	it("open → rejected: status changes and status-rejected-buyer entry is created", async () => {
		const database = await testabase("buyerRejectFx-open");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			const { transactionId } = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			yield* transactionRejectFx({
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

			expect(status).toBe("rejected");

			const entries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select("kind")
					.where("transactionId", "=", transactionId)
					.execute(),
			);

			const kinds = entries.map((e) => e.kind);
			expect(kinds).toContain("status-rejected-buyer");
			expect(kinds).not.toContain("status-rejected-seller");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
