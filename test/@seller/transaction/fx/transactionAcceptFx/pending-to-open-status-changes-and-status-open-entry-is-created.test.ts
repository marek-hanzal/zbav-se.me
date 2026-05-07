import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionAcceptFx", () => {
	it("interest → open: status changes and status-trade entry is created", async () => {
		const database = await testabase("transactionAcceptFx-interest-to-open");

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

			yield* transactionAcceptFx({
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

			expect(status).toBe("trade");

			const entries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select("kind")
					.where("transactionId", "=", tx.id)
					.execute(),
			);

			const kinds = entries.map((e) => e.kind);
			expect(kinds).toContain("status-interest");
			expect(kinds).toContain("status-trade");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
