import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import { transactionDisputeFx } from "~/buyer/transaction/server/fx/transactionDisputeFx";
import type { ScheduleSchema } from "~/common/@cron/schema/ScheduleSchema";
import { withCronFx } from "~/common/@cron/server/withCronFx";
import { TransactionEntrySensitiveKindEnumSchema } from "~/common/user-transaction/enum/TransactionEntrySensitiveKindEnumSchema";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { createResolvedScenarioFx } from "~/test/transaction/fx/createResolvedScenarioFx";
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

const ScheduleCases = [
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
	it.each(
		ScheduleCases,
	)("expires due interest/trade/resolved/dispute transactions and creates system messages for schedule $schedule", async ({
		schedule,
		now,
	}) => {
		const database = await testabase(`withCronFx-transaction-expiration-${schedule}`);

		return Effect.gen(function* () {
			const date = DateTime.fromISO(now, {
				setZone: true,
			});
			const before = date.minus({
				second: 1,
			});
			const after = date.plus({
				second: 1,
			});

			const { seller, buyer, stranger } = yield* createUsersFx({});

			const dueInterestScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			const dueTradeScenario = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: stranger.id,
			});
			const dueResolvedScenario = yield* createResolvedScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			const dueDisputeScenario = yield* Effect.gen(function* () {
				const scenario = yield* createResolvedScenarioFx({
					sellerId: seller.id,
					buyerId: stranger.id,
				});

				yield* transactionDisputeFx({
					transactionId: scenario.transactionId,
					userId: stranger.id,
				});

				return scenario;
			});
			const futureTradeScenario = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			const dueTransactionIds = [
				dueInterestScenario.transactionId,
				dueTradeScenario.transactionId,
				dueResolvedScenario.transactionId,
				dueDisputeScenario.transactionId,
			];

			yield* Effect.promise(() =>
				database.kysely
					.updateTable("transaction")
					.set({
						expiresAt: before.toJSDate(),
					})
					.where("id", "=", dueInterestScenario.transactionId)
					.execute(),
			);

			yield* Effect.promise(() =>
				database.kysely
					.updateTable("transaction")
					.set({
						expiresAt: date.toJSDate(),
					})
					.where("id", "=", dueTradeScenario.transactionId)
					.execute(),
			);

			yield* Effect.promise(() =>
				database.kysely
					.updateTable("transaction")
					.set({
						expiresAt: before.toJSDate(),
					})
					.where("id", "=", dueResolvedScenario.transactionId)
					.execute(),
			);

			yield* Effect.promise(() =>
				database.kysely
					.updateTable("transaction")
					.set({
						expiresAt: before.toJSDate(),
					})
					.where("id", "=", dueDisputeScenario.transactionId)
					.execute(),
			);

			yield* Effect.promise(() =>
				database.kysely
					.updateTable("transaction")
					.set({
						expiresAt: after.toJSDate(),
					})
					.where("id", "=", futureTradeScenario.transactionId)
					.execute(),
			);

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("transaction_entry")
					.values(
						dueTransactionIds.flatMap((transactionId, index) => {
							return [
								...TransactionEntrySensitiveKindEnumSchema.options.map((kind) => ({
									id: `${transactionId}-${kind}`,
									transactionId,
									kind,
									userId: buyer.id,
									payload: {
										text: `${kind}-${index}`,
									},
									createdAt: before.toJSDate(),
								})),
								{
									id: `${transactionId}-text`,
									transactionId,
									kind: "text" as const,
									userId: buyer.id,
									payload: {
										text: `keep-${index}`,
									},
									createdAt: before.toJSDate(),
								},
							];
						}),
					)
					.execute(),
			);

			yield* atFx(
				now,
				withCronFx({
					schedule,
				}),
			);

			const transactionIds = [
				...dueTransactionIds,
				futureTradeScenario.transactionId,
			];

			const transactions = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select([
						"id",
						"status",
					])
					.where("id", "in", transactionIds)
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
						id: dueResolvedScenario.transactionId,
						status: "expired",
					}),
					expect.objectContaining({
						id: dueDisputeScenario.transactionId,
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
					.where("transactionId", "in", transactionIds)
					.where("kind", "=", "status-expired")
					.orderBy("transactionId", "asc")
					.execute(),
			);

			expect(transactionEntries).toHaveLength(4);
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
					expect.objectContaining({
						transactionId: dueResolvedScenario.transactionId,
						kind: "status-expired",
						userId: null,
						payload: {
							text: "status-expired",
						},
					}),
					expect.objectContaining({
						transactionId: dueDisputeScenario.transactionId,
						kind: "status-expired",
						userId: null,
						payload: {
							text: "status-expired",
						},
					}),
				]),
			);

			const survivingStructuredEntries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select([
						"transactionId",
						"kind",
					])
					.where("transactionId", "in", dueTransactionIds)
					.where("kind", "in", TransactionEntrySensitiveKindEnumSchema.options)
					.execute(),
			);

			expect(survivingStructuredEntries).toHaveLength(0);

			const survivingTextEntries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select([
						"transactionId",
						"kind",
					])
					.where("transactionId", "in", dueTransactionIds)
					.where("kind", "=", "text")
					.execute(),
			);

			expect(survivingTextEntries).toHaveLength(4);

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
				if (
					payload == null ||
					typeof payload !== "object" ||
					!("transactionId" in payload)
				) {
					return false;
				}

				return [
					dueInterestScenario.transactionId,
					dueTradeScenario.transactionId,
					dueResolvedScenario.transactionId,
					dueDisputeScenario.transactionId,
				].includes(payload.transactionId);
			});

			expect(dueActivities).toHaveLength(8);
			expect(dueActivities.every(({ type }) => type === "system")).toBe(true);
			expect(
				dueActivities.every(({ payload }) => {
					return (
						payload != null &&
						typeof payload === "object" &&
						"transactionEntryId" in payload &&
						"target" in payload &&
						(payload.target === "buyer" || payload.target === "seller")
					);
				}),
			).toBe(true);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
