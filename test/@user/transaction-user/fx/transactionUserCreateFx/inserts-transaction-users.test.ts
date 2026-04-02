import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { transactionUserCreateFx } from "~/user/transaction-user/server/fx/transactionUserCreateFx";

describe("transactionUserCreateFx", () => {
	it("inserts transaction participants with expected sides", async () => {
		const database = await testabase("transactionUserCreateFx-insert-contract");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const users = yield* createUsersFx({
				api,
				slug: "transaction-user-create",
			});

			const scenario = yield* createPendingScenarioFx({
				sellerId: users.seller.id,
				buyerId: users.buyer.id,
			});

			const transaction = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", scenario.listingId)
					.executeTakeFirstOrThrow(),
			);

			yield* Effect.promise(() =>
				database.kysely
					.deleteFrom("transaction_user")
					.where("transactionId", "=", transaction.id)
					.execute(),
			);

			const fixedNow = DateTime.fromISO("2026-04-02T13:00:00.000Z");

			yield* transactionUserCreateFx({
				transactionId: transaction.id,
				users: [
					{
						userId: users.seller.id,
						side: "seller",
					},
					{
						userId: users.buyer.id,
						side: "buyer",
					},
				],
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => fixedNow,
				}),
			);

			const transactionUsers = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_user")
					.select([
						"userId",
						"side",
						"createdAt",
					])
					.where("transactionId", "=", transaction.id)
					.orderBy("side", "asc")
					.execute(),
			);

			expect(transactionUsers).toHaveLength(2);
			expect(
				transactionUsers.map((item) => ({
					userId: item.userId,
					side: item.side,
				})),
			).toEqual(
				expect.arrayContaining([
					{
						userId: users.buyer.id,
						side: "buyer",
					},
					{
						userId: users.seller.id,
						side: "seller",
					},
				]),
			);
			expect(
				transactionUsers.every(
					(item) => item.createdAt.toISOString() === fixedNow.toUTC().toISO(),
				),
			).toBe(true);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
