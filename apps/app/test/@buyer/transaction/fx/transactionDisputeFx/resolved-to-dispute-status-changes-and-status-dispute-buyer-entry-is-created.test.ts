import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionDisputeFx } from "~/@buyer/transaction/server/fx/transactionDisputeFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createResolvedScenarioFx } from "~/test/utils/createResolvedScenarioFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("transactionDisputeFx (buyer)", () => {
	it("resolved → dispute: status changes and status-dispute-buyer entry is created", async () => {
		const database = await testabase("buyerDisputeFx-resolved-to-dispute");

		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@buyer-dispute.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);
			const { user: buyer } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "buyer@buyer-dispute.cz",
						name: "Buyer",
						password: "12345678",
					},
				}),
			);

			const { transactionId } = yield* createResolvedScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				database,
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
