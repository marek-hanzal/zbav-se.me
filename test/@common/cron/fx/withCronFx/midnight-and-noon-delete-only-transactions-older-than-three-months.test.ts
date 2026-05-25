import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import type { ScheduleSchema } from "~/common/@cron/schema/ScheduleSchema";
import { withCronFx } from "~/common/@cron/server/withCronFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

const atFx = <A, E, R>(iso: string, eff: Effect.Effect<A, E, R>) =>
	eff.pipe(
		Effect.provideService(DateContextFx, {
			now: () => DateTime.fromISO(iso),
		}),
	);

describe("withCronFx transaction cleanup", () => {
	it.each([
		"00",
		"12",
	] satisfies ScheduleSchema.Type[])("deletes only transactions whose statusUpdatedAt is at or before the three-month cutoff for schedule %s", async (schedule) => {
		const database = await testabase(`withCronFx-transaction-cleanup-${schedule}`);

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
						statusUpdatedAt: new Date("2026-02-09T23:59:59.000Z"),
					})
					.where("id", "=", staleScenario.transactionId)
					.execute(),
			);

			yield* Effect.promise(() =>
				database.kysely
					.updateTable("transaction")
					.set({
						statusUpdatedAt: new Date("2026-02-10T00:00:00.000Z"),
					})
					.where("id", "=", boundaryScenario.transactionId)
					.execute(),
			);

			yield* Effect.promise(() =>
				database.kysely
					.updateTable("transaction")
					.set({
						statusUpdatedAt: new Date("2026-02-10T00:00:01.000Z"),
					})
					.where("id", "=", freshScenario.transactionId)
					.execute(),
			);

			yield* atFx(
				"2026-05-10T00:00:00.000Z",
				withCronFx({
					schedule,
				}),
			);

			const remainingTransactions = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select([
						"id",
					])
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
