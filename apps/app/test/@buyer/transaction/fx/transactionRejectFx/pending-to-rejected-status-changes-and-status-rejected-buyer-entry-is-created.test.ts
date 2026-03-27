import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionRejectFx } from "~/client/@buyer/transaction/server/fx/transactionRejectFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/utils/createPendingScenarioFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("transactionRejectFx (buyer)", () => {
	it("pending → rejected: status changes and status-rejected-buyer entry is created", async () => {
		const database = await testabase("buyerRejectFx-pending");

		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@buyer-reject-pending.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);
			const { user: buyer } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "buyer@buyer-reject-pending.cz",
						name: "Buyer",
						password: "12345678",
					},
				}),
			);

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
			expect(kinds).toContain("status-pending");
			expect(kinds).toContain("status-rejected-buyer");
			expect(kinds).not.toContain("status-rejected-seller");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
