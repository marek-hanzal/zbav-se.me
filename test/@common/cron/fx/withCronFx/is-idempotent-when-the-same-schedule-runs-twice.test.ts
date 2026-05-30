import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import type { ScheduleSchema } from "~/common/@cron/schema/ScheduleSchema";
import { withCronFx } from "~/common/@cron/server/withCronFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

const atFx = <A, E, R>(iso: string, eff: Effect.Effect<A, E, R>) =>
	eff.pipe(
		Effect.provideService(DateContextFx, {
			now: () =>
				DateTime.fromISO(iso, {
					setZone: true,
				}),
		}),
	);

const _ScheduleCases = [
	{
		schedule: "04",
		now: "2026-05-10T04:00:00.000Z",
	},
	{
		schedule: "16",
		now: "2026-05-10T16:00:00.000Z",
	},
] as const satisfies {
	now: string;
	schedule: ScheduleSchema.Type;
}[];

describe("withCronFx transaction expiration", () => {
	it("is idempotent when the same schedule runs twice", async () => {
		const database = await testabase("withCronFx-transaction-expiration-idempotent");

		return Effect.gen(function* () {
			const { seller, buyer } = yield* createUsersFx({});

			const dueInterestScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			yield* Effect.promise(() =>
				database.kysely
					.updateTable("transaction")
					.set({
						expiresAt: new Date("2026-05-10T03:59:59.000Z"),
					})
					.where("id", "=", dueInterestScenario.transactionId)
					.execute(),
			);

			yield* atFx(
				"2026-05-10T04:00:00.000Z",
				withCronFx({
					schedule: "04",
				}),
			);
			yield* atFx(
				"2026-05-10T04:00:00.000Z",
				withCronFx({
					schedule: "04",
				}),
			);

			const transactionEntries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select("id")
					.where("transactionId", "=", dueInterestScenario.transactionId)
					.where("kind", "=", "status-expired")
					.execute(),
			);

			const activities = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("activity")
					.select([
						"id",
						"payload",
					])
					.where("type", "=", "system")
					.execute(),
			);
			const dueActivities = activities.filter(({ payload }) => {
				return (
					payload != null &&
					typeof payload === "object" &&
					"transactionId" in payload &&
					payload.transactionId === dueInterestScenario.transactionId
				);
			});

			expect(transactionEntries).toHaveLength(1);
			expect(dueActivities).toHaveLength(2);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
