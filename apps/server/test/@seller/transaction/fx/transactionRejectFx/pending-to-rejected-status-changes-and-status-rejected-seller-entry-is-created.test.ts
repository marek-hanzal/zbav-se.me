import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionRejectFx } from "~/@seller/transaction/fx/transactionRejectFx";
import { auth } from "~/auth/auth";
import { createPendingScenarioFx, withRuntimeFx } from "~test/fixture/transactionFixture";
import { testabase } from "~test/testabase";

describe("transactionRejectFx (seller)", () => {
	it("pending → rejected: status changes and status-rejected-seller entry is created", async () => {
		const database = await testabase("sellerRejectFx-pending");

		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@seller-reject-pending.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);
			const { user: buyer } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "buyer@seller-reject-pending.cz",
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
			expect(kinds).toContain("status-pending");
			expect(kinds).toContain("status-rejected-seller");
			expect(kinds).not.toContain("status-rejected-buyer");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
