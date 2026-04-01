import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionPatchFx } from "~/seller/transaction/server/fx/transactionPatchFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/utils/createPendingScenarioFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("transactionPatchFx", () => {
	it("rejects a foreign seller patch and keeps the transaction unchanged", async () => {
		const database = await testabase("transactionPatchFx-foreign-seller");
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
				"transaction-patch-owner@test.cz",
				"Transaction Patch Owner",
			);
			const { user: buyer } = yield* signUp(
				"transaction-patch-owner-buyer@test.cz",
				"Transaction Patch Buyer",
			);
			const { user: strangerSeller } = yield* signUp(
				"transaction-patch-foreign@test.cz",
				"Transaction Patch Foreign",
			);

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
					userId: strangerSeller.id,
					patch: {
						status: "open",
					},
					query: {
						where: {
							id: transactionBefore.id,
						},
					},
					scope: {
						userId: strangerSeller.id,
					},
				}),
			);

			expect(foreignAttempt._tag).toBe("Left");

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
