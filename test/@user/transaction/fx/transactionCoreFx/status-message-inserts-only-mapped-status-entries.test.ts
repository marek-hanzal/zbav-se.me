import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { transactionStatusMessageFx } from "~/user/transaction/server/fx/transactionStatusMessageFx";

describe("transaction core", () => {
	it("inserts only mapped status messages and skips unsupported combinations", async () => {
		const database = await testabase("transactionCore-status-message");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

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

			const before = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select((eb) => eb.fn.countAll<number>().as("count"))
					.where("transactionId", "=", transaction.id)
					.executeTakeFirstOrThrow(),
			);

			yield* transactionStatusMessageFx({
				transactionId: transaction.id,
				request: "trade",
				target: "seller",
				userId: seller.id,
			});

			yield* transactionStatusMessageFx({
				transactionId: transaction.id,
				request: "resolved",
				target: "buyer",
				userId: buyer.id,
			});

			const entries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select("kind")
					.where("transactionId", "=", transaction.id)
					.execute(),
			);

			const after = entries.length;
			const kinds = entries.map((entry) => entry.kind);

			expect(after).toBe(Number(before.count) + 1);
			expect(kinds).toContain("status-trade");
			expect(kinds).not.toContain("status-resolved");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
