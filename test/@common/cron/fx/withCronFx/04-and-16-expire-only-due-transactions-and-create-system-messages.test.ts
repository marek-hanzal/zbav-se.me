import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import { transactionCloseFx } from "~/buyer/transaction/server/fx/transactionCloseFx";
import { transactionCreateFx } from "~/buyer/transaction/server/fx/transactionCreateFx";
import { transactionDisputeFx } from "~/buyer/transaction/server/fx/transactionDisputeFx";
import { transactionRejectFx } from "~/buyer/transaction/server/fx/transactionRejectFx";
import { transactionSuccessFx } from "~/buyer/transaction/server/fx/transactionSuccessFx";
import type { ScheduleSchema } from "~/common/@cron/schema/ScheduleSchema";
import { withCronFx } from "~/common/@cron/server/withCronFx";
import { TransactionEntrySensitiveKindEnumSchema } from "~/common/user-transaction/enum/TransactionEntrySensitiveKindEnumSchema";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { transactionResolveFx } from "~/seller/transaction/server/fx/transactionResolveFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
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

	it("does not touch terminal transactions even when they are overdue", async () => {
		const database = await testabase("withCronFx-transaction-expiration-terminal");

		return Effect.gen(function* () {
			const { seller, buyer, stranger } = yield* createUsersFx({});
			const now = "2026-05-10T04:00:00.000Z";
			const overdue = new Date("2026-05-10T03:59:59.000Z");

			const rejectedScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			yield* transactionRejectFx({
				transactionId: rejectedScenario.transactionId,
				userId: buyer.id,
			});

			const successScenario = yield* createResolvedScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			yield* transactionSuccessFx({
				transactionId: successScenario.transactionId,
				userId: buyer.id,
			});

			const closedScenario = yield* createResolvedScenarioFx({
				sellerId: seller.id,
				buyerId: stranger.id,
			});
			yield* transactionCloseFx({
				transactionId: closedScenario.transactionId,
				userId: stranger.id,
			});

			const expiredScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			yield* Effect.promise(() =>
				database.kysely
					.updateTable("transaction")
					.set({
						status: "expired",
					})
					.where("id", "=", expiredScenario.transactionId)
					.execute(),
			);

			const soldScenario = yield* Effect.gen(function* () {
				const listing = yield* createListingFx(seller.id, {
					title: "Sold listing",
				});

				const resolved = yield* transactionCreateFx({
					listingId: listing.id,
					userId: buyer.id,
				});
				const sold = yield* transactionCreateFx({
					listingId: listing.id,
					userId: stranger.id,
				});

				yield* transactionAcceptFx({
					transactionId: resolved.id,
					userId: seller.id,
				});
				yield* transactionResolveFx({
					transactionId: resolved.id,
					userId: seller.id,
				});

				return {
					transactionId: sold.id,
				};
			});

			const terminalTransactionIds = [
				rejectedScenario.transactionId,
				successScenario.transactionId,
				closedScenario.transactionId,
				expiredScenario.transactionId,
				soldScenario.transactionId,
			];

			yield* Effect.promise(() =>
				database.kysely
					.updateTable("transaction")
					.set({
						expiresAt: overdue,
					})
					.where("id", "in", terminalTransactionIds)
					.execute(),
			);

			yield* atFx(
				now,
				withCronFx({
					schedule: "04",
				}),
			);

			const transactions = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select([
						"id",
						"status",
					])
					.where("id", "in", terminalTransactionIds)
					.orderBy("id", "asc")
					.execute(),
			);

			expect(transactions).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: rejectedScenario.transactionId,
						status: "rejected",
					}),
					expect.objectContaining({
						id: successScenario.transactionId,
						status: "success",
					}),
					expect.objectContaining({
						id: closedScenario.transactionId,
						status: "closed",
					}),
					expect.objectContaining({
						id: expiredScenario.transactionId,
						status: "expired",
					}),
					expect.objectContaining({
						id: soldScenario.transactionId,
						status: "sold",
					}),
				]),
			);

			const transactionEntries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select("transactionId")
					.where("transactionId", "in", terminalTransactionIds)
					.where("kind", "=", "status-expired")
					.execute(),
			);

			expect(transactionEntries).toHaveLength(0);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});

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
