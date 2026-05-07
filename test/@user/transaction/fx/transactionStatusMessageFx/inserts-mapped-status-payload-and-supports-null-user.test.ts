import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { transactionStatusMessageFx } from "~/user/transaction/server/fx/transactionStatusMessageFx";

describe("transactionStatusMessageFx", () => {
	it("writes mapped entries with payload text and allows null user for system statuses", async () => {
		const database = await testabase("transactionStatusMessageFx-direct");

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

			yield* transactionStatusMessageFx({
				transactionId: transaction.id,
				request: "trade",
				target: "seller",
				userId: seller.id,
			});
			yield* transactionStatusMessageFx({
				transactionId: transaction.id,
				request: "expired",
				target: null,
				userId: null,
			});

			const entries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select([
						"kind",
						"userId",
						"payload",
					])
					.where("transactionId", "=", transaction.id)
					.where("kind", "in", [
						"status-trade",
						"status-expired",
					])
					.orderBy("createdAt", "asc")
					.execute(),
			);

			expect(entries).toHaveLength(2);
			expect(entries[0]).toMatchObject({
				kind: "status-trade",
				userId: seller.id,
				payload: {
					text: "status-trade",
				},
			});
			expect(entries[1]).toMatchObject({
				kind: "status-expired",
				userId: null,
				payload: {
					text: "status-expired",
				},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
