import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import type { ScheduleSchema } from "~/common/@cron/schema/ScheduleSchema";
import { withCronFx } from "~/common/@cron/server/withCronFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
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

describe("withCronFx transaction expiration", () => {
	it.each([
		"04",
		"16",
	] satisfies ScheduleSchema.Type[])("expires only due transactions and creates system messages for schedule %s", async (schedule) => {
		const database = await testabase(`withCronFx-transaction-expiration-${schedule}`);

		return Effect.gen(function* () {
			const { seller, buyer, stranger } = yield* createUsersFx({});

			const dueInterestScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			const dueTradeScenario = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: stranger.id,
			});
			const futureTradeScenario = yield* createOpenScenarioFx({
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

			yield* Effect.promise(() =>
				database.kysely
					.updateTable("transaction")
					.set({
						expiresAt: new Date("2026-05-10T04:00:00.000Z"),
					})
					.where("id", "=", dueTradeScenario.transactionId)
					.execute(),
			);

			yield* Effect.promise(() =>
				database.kysely
					.updateTable("transaction")
					.set({
						expiresAt: new Date("2026-05-10T04:00:01.000Z"),
					})
					.where("id", "=", futureTradeScenario.transactionId)
					.execute(),
			);

			yield* atFx(
				"2026-05-10T04:00:00.000Z",
				withCronFx({
					schedule,
				}),
			);

			const transactions = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select([
						"id",
						"status",
					])
					.where("id", "in", [
						dueInterestScenario.transactionId,
						dueTradeScenario.transactionId,
						futureTradeScenario.transactionId,
					])
					.orderBy("id", "asc")
					.execute(),
			);

			expect(transactions).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: dueInterestScenario.transactionId,
						status: "expired",
					}),
					expect.objectContaining({
						id: dueTradeScenario.transactionId,
						status: "expired",
					}),
					expect.objectContaining({
						id: futureTradeScenario.transactionId,
						status: "trade",
					}),
				]),
			);

			const transactionEntries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select([
						"transactionId",
						"kind",
						"userId",
						"payload",
					])
					.where("transactionId", "in", [
						dueInterestScenario.transactionId,
						dueTradeScenario.transactionId,
						futureTradeScenario.transactionId,
					])
					.where("kind", "=", "status-expired")
					.orderBy("transactionId", "asc")
					.execute(),
			);

			expect(transactionEntries).toHaveLength(2);
			expect(transactionEntries).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						transactionId: dueInterestScenario.transactionId,
						kind: "status-expired",
						userId: null,
						payload: {
							text: "status-expired",
						},
					}),
					expect.objectContaining({
						transactionId: dueTradeScenario.transactionId,
						kind: "status-expired",
						userId: null,
						payload: {
							text: "status-expired",
						},
					}),
				]),
			);

			const activities = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("activity")
					.select([
						"userId",
						"type",
						"payload",
					])
					.where("type", "=", "system")
					.orderBy("userId", "asc")
					.execute(),
			);
			const dueActivities = activities.filter(({ payload }) => {
				if (payload == null || typeof payload !== "object") {
					return false;
				}

				if (!("transactionId" in payload)) {
					return false;
				}

				return (
					payload.transactionId === dueInterestScenario.transactionId ||
					payload.transactionId === dueTradeScenario.transactionId
				);
			});

			expect(dueActivities).toHaveLength(4);
			expect(dueActivities.every(({ type }) => type === "system")).toBe(true);
			expect(
				dueActivities.every(({ payload }) => {
					return (
						payload != null &&
						typeof payload === "object" &&
						"transactionEntryId" in payload &&
						"target" in payload
					);
				}),
			).toBe(true);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
