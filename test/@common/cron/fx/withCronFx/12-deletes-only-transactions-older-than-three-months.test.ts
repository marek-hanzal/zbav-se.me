import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { runCronAtFx } from "./runCronAtFx";

describe("withCronFx transaction cleanup", () => {
	it("deletes only transactions whose statusUpdatedAt is at or before the three-month cutoff for schedule 12", async () => {
		const database = await testabase("withCronFx-transaction-cleanup-12");

		return Effect.gen(function* () {
			const { seller, buyer, stranger } = yield* createUsersFx({});

			const staleScenario = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			const boundaryScenario = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: stranger.id,
			});
			const freshScenario = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			yield* Effect.promise(() =>
				database.kysely
					.updateTable("transaction")
					.set({
						statusUpdatedAt: new Date("2026-02-10T11:59:59.000Z"),
					})
					.where("id", "=", staleScenario.transactionId)
					.execute(),
			);

			yield* Effect.promise(() =>
				database.kysely
					.updateTable("transaction")
					.set({
						statusUpdatedAt: new Date("2026-02-10T12:00:00.000Z"),
					})
					.where("id", "=", boundaryScenario.transactionId)
					.execute(),
			);

			yield* Effect.promise(() =>
				database.kysely
					.updateTable("transaction")
					.set({
						statusUpdatedAt: new Date("2026-02-10T12:00:01.000Z"),
					})
					.where("id", "=", freshScenario.transactionId)
					.execute(),
			);

			yield* runCronAtFx({
				schedule: "12",
				now: "2026-05-10T12:00:00.000Z",
			});

			const remainingTransactions = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("id", "in", [
						staleScenario.transactionId,
						boundaryScenario.transactionId,
						freshScenario.transactionId,
					])
					.orderBy("id", "asc")
					.execute(),
			);

			expect(remainingTransactions.map(({ id }) => id)).toEqual([
				freshScenario.transactionId,
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
