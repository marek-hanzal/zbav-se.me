import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionPatchFx } from "~/seller/transaction/server/fx/transactionPatchFx";
import { expectErrorFx } from "~/test/common/fx/expectErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("transactionPatchFx", () => {
	it("rejects a foreign seller patch and keeps the transaction unchanged", async () => {
		const database = await testabase("transactionPatchFx-foreign-seller");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});
			const seller = users.seller;
			const buyer = users.buyer;
			const stranger = users.stranger;

			const scenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const transactionBefore = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select([
						"id",
						"status",
						"statusUpdatedAt",
					])
					.where("listingId", "=", scenario.listingId)
					.executeTakeFirstOrThrow(),
			);

			const foreignAttempt = yield* Effect.either(
				transactionPatchFx({
					userId: stranger.id,
					patch: {
						status: "trade",
					},
					query: {
						where: {
							id: transactionBefore.id,
						},
					},
					scope: {
						userId: stranger.id,
					},
				}),
			);

			expectErrorFx(foreignAttempt);

			const transactionAfter = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select([
						"status",
						"statusUpdatedAt",
					])
					.where("id", "=", transactionBefore.id)
					.executeTakeFirstOrThrow(),
			);

			expect(transactionAfter.status).toBe(transactionBefore.status);
			expect(transactionAfter.statusUpdatedAt.getTime()).toBe(
				transactionBefore.statusUpdatedAt.getTime(),
			);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
