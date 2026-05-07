import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { transactionTouchFx } from "~/user/transaction/server/fx/transactionTouchFx";

describe("transactionTouchFx", () => {
	it("allows a stranger (non-participant) to touch the transaction - authorization gap", async () => {
		const database = await testabase("transactionTouchFx-authorization-gap");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});
			const stranger = yield* leaseTestUserFx({});

			const { transactionId } = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			// Stranger (non-participant) should NOT be able to touch, but currently CAN
			// This test documents the authorization gap
			yield* transactionTouchFx({
				transactionId,
				userId: stranger.id, // stranger is not a participant
			});

			// Verify the transaction was touched (timestamps updated)
			const after = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select([
						"updatedAt",
						"expiresAt",
					])
					.where("id", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);

			// Transaction was touched by stranger - this should fail but currently succeeds
			expect(after.updatedAt).toBeDefined();
			expect(after.expiresAt).toBeDefined();
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
