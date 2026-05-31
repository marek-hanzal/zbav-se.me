import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import { transactionCloseFx } from "~/buyer/transaction/server/fx/transactionCloseFx";
import { transactionCreateFx } from "~/buyer/transaction/server/fx/transactionCreateFx";
import { transactionRejectFx } from "~/buyer/transaction/server/fx/transactionRejectFx";
import { transactionSuccessFx } from "~/buyer/transaction/server/fx/transactionSuccessFx";
import type { ScheduleSchema } from "~/common/@cron/schema/ScheduleSchema";
import { withCronFx } from "~/common/@cron/server/withCronFx";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { transactionResolveFx } from "~/seller/transaction/server/fx/transactionResolveFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
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
});
