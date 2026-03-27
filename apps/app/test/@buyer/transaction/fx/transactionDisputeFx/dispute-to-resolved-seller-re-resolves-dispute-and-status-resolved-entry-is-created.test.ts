import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionDisputeFx } from "~/@buyer/transaction/fx/transactionDisputeFx";
import { transactionResolveFx } from "~/@seller/transaction/fx/transactionResolveFx";
import { auth } from "~/auth/auth";
import { testabase } from "~/test/testabase";
import { createResolvedScenarioFx } from "~/test/utils/createResolvedScenarioFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("transactionDisputeFx (buyer)", () => {
	it("dispute → resolved: seller re-resolves dispute and status-resolved entry is created", async () => {
		const database = await testabase("buyerDisputeFx-dispute-to-resolved");

		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@dispute-re-resolve.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);
			const { user: buyer } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "buyer@dispute-re-resolve.cz",
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

			yield* transactionResolveFx({
				transactionId,
				userId: seller.id,
			});

			const { status } = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("status")
					.where("id", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);

			expect(status).toBe("resolved");

			const entries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select("kind")
					.where("transactionId", "=", transactionId)
					.orderBy("createdAt", "asc")
					.execute(),
			);

			const kinds = entries.map((e) => e.kind);
			expect(kinds).toContain("status-dispute-buyer");
			expect(kinds.filter((k) => k === "status-resolved")).toHaveLength(2);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
