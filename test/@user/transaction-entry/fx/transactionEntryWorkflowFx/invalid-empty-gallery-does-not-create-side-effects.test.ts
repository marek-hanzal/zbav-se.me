import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { fetchActivityItemsFx } from "~/test/activity/fx/fetchActivityItemsFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";

describe("transactionEntry workflow", () => {
	it("rejects empty gallery payload and does not create touch, activity or entry side effects", async () => {
		const database = await testabase("transactionEntry-empty-gallery");

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
					.select((eb) => eb.fn.countAll<number>().as("count"))
					.where("transactionId", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);
			const beforeSellerActivity = yield* fetchActivityItemsFx({
				database,
				userId: seller.id,
				type: "buyer-message",
			});

			const result = yield* Effect.either(
				transactionEntryCreateFx({
					userId: buyer.id,
					transactionId,
					kind: "gallery",
					payload: {
						uploadIds: [],
					},
				}),
			);

			expectTaggedErrorFx(result, {
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
					.select((eb) => eb.fn.countAll<number>().as("count"))
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
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
