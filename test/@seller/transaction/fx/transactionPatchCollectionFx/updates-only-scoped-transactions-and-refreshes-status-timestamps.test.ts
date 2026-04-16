import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionPatchCollectionFx } from "~/seller/transaction/server/fx/transactionPatchCollectionFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { getDefaultListingCreateFx } from "~/test/listing/fx/getDefaultListingCreateFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("transactionPatchCollectionFx", () => {
	it("updates only scoped seller transactions and refreshes statusUpdatedAt", async () => {
		const database = await testabase("transactionPatchCollectionFx-scope");

		return Effect.gen(function* () {
			const { seller, buyer, stranger } = yield* createUsersFx({});
			const listing = yield* getDefaultListingCreateFx;

			const ownScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				listing,
			});
			const strangerScenario = yield* createPendingScenarioFx({
				sellerId: stranger.id,
				buyerId: buyer.id,
				listing,
			});

			const ownBefore = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select([
						"id",
						"statusUpdatedAt",
					])
					.where("id", "=", ownScenario.transactionId)
					.executeTakeFirstOrThrow(),
			);
			const strangerBefore = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select([
						"id",
						"status",
						"statusUpdatedAt",
					])
					.where("id", "=", strangerScenario.transactionId)
					.executeTakeFirstOrThrow(),
			);

			const updated = yield* transactionPatchCollectionFx({
				patch: {
					status: "trade",
				},
				query: {
					where: {
						listingId: ownScenario.listingId,
					},
				},
				scope: {
					userId: seller.id,
				},
			});

			expect(updated).toHaveLength(1);
			expect(updated[0]?.id).toBe(ownBefore.id);
			expect(updated[0]?.status).toBe("trade");

			const ownAfter = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select([
						"status",
						"statusUpdatedAt",
					])
					.where("id", "=", ownBefore.id)
					.executeTakeFirstOrThrow(),
			);
			const strangerAfter = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select([
						"status",
						"statusUpdatedAt",
					])
					.where("id", "=", strangerBefore.id)
					.executeTakeFirstOrThrow(),
			);

			expect(ownAfter.status).toBe("trade");
			expect(ownAfter.statusUpdatedAt.getTime()).toBeGreaterThan(
				ownBefore.statusUpdatedAt.getTime(),
			);
			expect(strangerAfter.status).toBe(strangerBefore.status);
			expect(strangerAfter.statusUpdatedAt.getTime()).toBe(
				strangerBefore.statusUpdatedAt.getTime(),
			);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
