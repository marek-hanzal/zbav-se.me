import { withDateServiceFx } from "@/lib/common/date";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { transactionDisputeFx } from "~/buyer/transaction/server/fx/transactionDisputeFx";
import type { ScheduleSchema } from "~/common/@cron/schema/ScheduleSchema";
import { withCronFx } from "~/common/@cron/server/withCronFx";
import { TransactionEntrySensitiveKindEnumSchema } from "~/common/user-transaction/enum/TransactionEntrySensitiveKindEnumSchema";
import type { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { createResolvedScenarioFx } from "~/test/transaction/fx/createResolvedScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

const atFx = <A, E, R>(iso: string, eff: Effect.Effect<A, E, R>) =>
	eff.pipe(
		withDateServiceFx({
			now: () =>
				DateTime.fromISO(iso, {
					setZone: true,
				}),
		}),
	);

export const runTransactionExpirationCronScenarioFx = ({
	database,
	schedule,
	now,
}: {
	database: TestDatabase;
	schedule: ScheduleSchema.Type;
	now: string;
}) =>
	Effect.gen(function* () {
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

		for (const { transactionId, expiresAt } of [
			{
				transactionId: dueInterestScenario.transactionId,
				expiresAt: before,
			},
			{
				transactionId: dueTradeScenario.transactionId,
				expiresAt: date,
			},
			{
				transactionId: dueResolvedScenario.transactionId,
				expiresAt: before,
			},
			{
				transactionId: dueDisputeScenario.transactionId,
				expiresAt: before,
			},
			{
				transactionId: futureTradeScenario.transactionId,
				expiresAt: after,
			},
		]) {
			yield* Effect.promise(() =>
				database.kysely
					.updateTable("transaction")
					.set({
						expiresAt: expiresAt.toJSDate(),
					})
					.where("id", "=", transactionId)
					.execute(),
			);
		}

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
			if (payload == null || typeof payload !== "object" || !("transactionId" in payload)) {
				return false;
			}

			return dueTransactionIds.includes(payload.transactionId);
		});

		return {
			dueDisputeScenario,
			dueInterestScenario,
			dueResolvedScenario,
			dueTradeScenario,
			futureTradeScenario,
			transactions,
			transactionEntries,
			survivingStructuredEntries,
			survivingTextEntries,
			dueActivities,
		} as const;
	});
