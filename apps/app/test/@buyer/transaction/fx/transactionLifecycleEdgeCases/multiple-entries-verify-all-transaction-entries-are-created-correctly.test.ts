import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCloseFx } from "~/@buyer/transaction/fx/transactionCloseFx";
import { transactionAcceptFx } from "~/@seller/transaction/fx/transactionAcceptFx";
import { transactionResolveFx } from "~/@seller/transaction/fx/transactionResolveFx";
import { auth } from "~/auth/auth";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/utils/createPendingScenarioFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("transactionLifecycleEdgeCases (buyer)", () => {
	it("multiple entries: verify all transaction entries are created correctly", async () => {
		const database = await testabase("buyerCloseFx-multiple-entries");

		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller } = yield* Effect.promise(async () => {
				return api.signUpEmail({
					body: {
						email: "seller@multiple.cz",
						name: "Seller",
						password: "12345678",
					},
				});
			});
			const { user: buyer } = yield* Effect.promise(async () => {
				return api.signUpEmail({
					body: {
						email: "buyer@multiple.cz",
						name: "Buyer",
						password: "12345678",
					},
				});
			});

			const { listingId } = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const tx = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", listingId)
					.where("userId", "=", buyer.id)
					.executeTakeFirstOrThrow();
			});

			yield* transactionAcceptFx({
				transactionId: tx.id,
				userId: seller.id,
			});

			yield* transactionResolveFx({
				transactionId: tx.id,
				userId: seller.id,
			});

			yield* transactionCloseFx({
				transactionId: tx.id,
				userId: buyer.id,
			});

			const entries = yield* Effect.promise(async () => {
				return database.kysely
					.selectFrom("transaction_entry")
					.select([
						"kind",
						"createdAt",
					])
					.where("transactionId", "=", tx.id)
					.orderBy("createdAt", "asc")
					.execute();
			});

			const kinds = entries.map((e) => e.kind);
			expect(kinds).toContain("status-pending");
			expect(kinds).toContain("status-resolved");
			expect(kinds).toContain("status-closed");
			expect(entries.length).toBeGreaterThanOrEqual(3);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
