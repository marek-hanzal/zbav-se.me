import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { transactionStatusMessageFx } from "~/user/transaction/server/fx/transactionStatusMessageFx";

describe("transactionStatusMessageFx", () => {
	it("writes mapped entries with payload text and allows null user for system statuses", async () => {
		const database = await testabase("transactionStatusMessageFx-direct");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "status-direct-seller@test.cz",
						name: "Status Direct Seller",
						password: "12345678",
					},
				}),
			);
			const { user: buyer } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "status-direct-buyer@test.cz",
						name: "Status Direct Buyer",
						password: "12345678",
					},
				}),
			);

			const { listingId } = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const transaction = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", listingId)
					.where("userId", "=", buyer.id)
					.executeTakeFirstOrThrow(),
			);

			yield* transactionStatusMessageFx({
				transactionId: transaction.id,
				request: "open",
				target: "seller",
				userId: seller.id,
			});
			yield* transactionStatusMessageFx({
				transactionId: transaction.id,
				request: "expired",
				target: null,
				userId: null,
			});

			const entries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select([
						"kind",
						"userId",
						"payload",
					])
					.where("transactionId", "=", transaction.id)
					.where("kind", "in", [
						"status-open",
						"status-expired",
					])
					.orderBy("createdAt", "asc")
					.execute(),
			);

			expect(entries).toHaveLength(2);
			expect(entries[0]).toMatchObject({
				kind: "status-open",
				userId: seller.id,
				payload: {
					text: "status-open",
				},
			});
			expect(entries[1]).toMatchObject({
				kind: "status-expired",
				userId: null,
				payload: {
					text: "status-expired",
				},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
