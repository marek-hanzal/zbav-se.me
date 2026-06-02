import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionPatchCollectionFx } from "~/seller/transaction/server/fx/transactionPatchCollectionFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionPatchCollectionFx — foreign isolation", () => {
	it("only patches scoped transactions and leaves stranger transactions unchanged", async () => {
		const database = await testabase("transactionPatchCollectionFx-foreign-isolation");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const stranger = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			// Create two transactions on different listings by the same seller
			const ownScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const strangerScenario = yield* createPendingScenarioFx({
				sellerId: stranger.id,
				buyerId: buyer.id,
			});

			// Seller patches their own transaction
			yield* transactionPatchCollectionFx({
				patch: {
					status: "trade",
				},
				query: {
					where: {
						listingId: ownScenario.listingId,
						statusIn: [
							"interest",
						],
					},
				},
				scope: {
					userId: seller.id,
				},
			});

			// Verify own transaction was patched
			const ownTx = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("status")
					.where("id", "=", ownScenario.transactionId)
					.executeTakeFirstOrThrow(),
			);

			// Verify stranger transaction was NOT affected
			const strangerTx = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("status")
					.where("id", "=", strangerScenario.transactionId)
					.executeTakeFirstOrThrow(),
			);

			expect(ownTx.status).toBe("trade");
			expect(strangerTx.status).toBe("interest"); // Should remain unchanged
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
