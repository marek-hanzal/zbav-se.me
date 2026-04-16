import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCloseFx } from "~/buyer/transaction/server/fx/transactionCloseFx";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { transactionResolveFx } from "~/seller/transaction/server/fx/transactionResolveFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionLifecycleEdgeCases (buyer)", () => {
	it("multiple entries: verify all transaction entries are created correctly", async () => {
		const database = await testabase("buyerCloseFx-multiple-entries");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

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
			expect(kinds).toContain("status-interest");
			expect(kinds).toContain("status-resolved");
			expect(kinds).toContain("status-closed");
			expect(entries.length).toBeGreaterThanOrEqual(3);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
