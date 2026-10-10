import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { fetchActivityItemsFx } from "~/test/activity/fx/fetchActivityItemsFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { transactionEntryCreateFx } from "~/user-transaction-entry/fx/transactionEntryCreateFx";

describe("transactionEntry workflow", () => {
	it("rejects empty gallery payload and does not create touch, activity or entry side effects", async () => {
		const database = await testabaseFn("transactionEntry-empty-gallery");

		return Effect.gen(function* () {
			const { seller, buyer } = yield* createUsersFx({});
			const { transactionId } = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const beforeTransaction = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select([
						"updatedAt",
						"expiresAt",
					])
					.where("id", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);
			const beforeEntryCount = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select((ebFn) => ebFn.fn.countAll<number>().as("count"))
					.where("transactionId", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);
			const beforeSellerActivity = yield* fetchActivityItemsFx({
				database,
				userId: seller.id,
				type: "buyer-message",
			});

			const result = yield* Effect.result(
				transactionEntryCreateFx({
					userId: buyer.id,
					transactionId,
					kind: "gallery",
					payload: {
						uploadIds: [],
					},
				}),
			);

			expectTaggedErrorFn(result, {
				tag: "InvalidRequestErrorFx",
				message: "At least one upload is required",
			});

			const afterTransaction = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select([
						"updatedAt",
						"expiresAt",
					])
					.where("id", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);
			const afterEntryCount = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select((ebFn) => ebFn.fn.countAll<number>().as("count"))
					.where("transactionId", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);
			const sellerActivity = yield* fetchActivityItemsFx({
				database,
				userId: seller.id,
				type: "buyer-message",
			});

			expect(afterTransaction.updatedAt.getTime()).toBe(
				beforeTransaction.updatedAt.getTime(),
			);
			expect(afterTransaction.expiresAt.getTime()).toBe(
				beforeTransaction.expiresAt.getTime(),
			);
			expect(afterEntryCount.count).toBe(beforeEntryCount.count);
			expect(sellerActivity).toHaveLength(beforeSellerActivity.length);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
