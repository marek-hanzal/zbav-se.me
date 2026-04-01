import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/utils/createPendingScenarioFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";
import { transactionStatusMessageFx } from "~/user/transaction/server/fx/transactionStatusMessageFx";

describe("transaction core", () => {
	it("inserts only mapped status messages and skips unsupported combinations", async () => {
		const database = await testabase("transactionCore-status-message");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "status-message-seller@test.cz",
						name: "Status Seller",
						password: "12345678",
					},
				}),
			);
			const { user: buyer } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "status-message-buyer@test.cz",
						name: "Status Buyer",
						password: "12345678",
					},
				}),
			);

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
				request: "open",
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
			expect(kinds).toContain("status-open");
			expect(kinds).not.toContain("status-resolved");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
