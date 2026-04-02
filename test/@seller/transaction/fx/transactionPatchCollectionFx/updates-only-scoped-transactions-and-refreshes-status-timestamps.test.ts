import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionPatchCollectionFx } from "~/seller/transaction/server/fx/transactionPatchCollectionFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";

describe("transactionPatchCollectionFx", () => {
	it("updates only scoped seller transactions and refreshes statusUpdatedAt", async () => {
		const database = await testabase("transactionPatchCollectionFx-scope");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const signUp = (email: string, name: string) =>
				Effect.promise(() =>
					api.signUpEmail({
						body: {
							email,
							name,
							password: "12345678",
						},
					}),
				);

			const { user: seller } = yield* signUp(
				"transaction-patch-seller@test.cz",
				"Transaction Patch Seller",
			);
			const { user: buyer } = yield* signUp(
				"transaction-patch-buyer@test.cz",
				"Transaction Patch Buyer",
			);
			const { user: strangerSeller } = yield* signUp(
				"transaction-patch-stranger-seller@test.cz",
				"Transaction Patch Stranger Seller",
			);
			const { user: strangerBuyer } = yield* signUp(
				"transaction-patch-stranger-buyer@test.cz",
				"Transaction Patch Stranger Buyer",
			);

			const ownScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			const strangerScenario = yield* createPendingScenarioFx({
				sellerId: strangerSeller.id,
				buyerId: strangerBuyer.id,
			});

			const ownBefore = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select([
						"id",
						"statusUpdatedAt",
					])
					.where("listingId", "=", ownScenario.listingId)
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
					.where("listingId", "=", strangerScenario.listingId)
					.executeTakeFirstOrThrow(),
			);

			const updated = yield* transactionPatchCollectionFx({
				patch: {
					status: "open",
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
			expect(updated[0]?.status).toBe("open");

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

			expect(ownAfter.status).toBe("open");
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
