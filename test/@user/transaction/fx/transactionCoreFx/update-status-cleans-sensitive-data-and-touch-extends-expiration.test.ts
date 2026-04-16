import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { transactionTouchFx } from "~/user/transaction/server/fx/transactionTouchFx";
import { transactionUpdateStatusFx } from "~/user/transaction/server/fx/transactionUpdateStatusFx";

describe("transaction core", () => {
	it("updates status, cleans sensitive data on terminal transition, and extends expiration on touch", async () => {
		const database = await testabase("transactionCore-update-touch");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			const { transactionId } = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("transaction_entry")
					.values([
						{
							id: "core-location",
							transactionId,
							kind: "location",
							userId: seller.id,
							payload: {
								text: "location data",
							},
							createdAt: new Date(),
						},
						{
							id: "core-personal",
							transactionId,
							kind: "personal",
							userId: buyer.id,
							payload: {
								text: "personal data",
							},
							createdAt: new Date(),
						},
					])
					.execute(),
			);

			const beforeTouch = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select([
						"expiresAt",
						"updatedAt",
					])
					.where("id", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);

			yield* transactionTouchFx({
				transactionId,
				userId: seller.id,
			});

			const afterTouch = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select([
						"expiresAt",
						"updatedAt",
					])
					.where("id", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);

			expect(afterTouch.expiresAt.getTime()).toBeGreaterThan(beforeTouch.expiresAt.getTime());
			expect(afterTouch.updatedAt.getTime()).toBeGreaterThanOrEqual(
				beforeTouch.updatedAt.getTime(),
			);

			yield* transactionUpdateStatusFx({
				transactionId,
				status: "trade",
				request: "rejected",
				target: "seller",
			});

			const transaction = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("status")
					.where("id", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);

			expect(transaction.status).toBe("rejected");

			const remainingSensitive = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select("kind")
					.where("transactionId", "=", transactionId)
					.where("kind", "in", [
						"location",
						"personal",
					])
					.execute(),
			);

			expect(remainingSensitive).toHaveLength(0);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
