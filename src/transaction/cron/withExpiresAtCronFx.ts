import { Chunk, Effect } from "effect";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import type { ActivityTableSchema } from "~/database/schema/ActivityTable";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { genIdFn } from "~/identity/fn/genIdFn";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { TransactionEntrySensitiveKindEnumSchema } from "~/transaction-contract/schema/TransactionEntrySensitiveKindEnumSchema";
import { Transitions } from "~/user-transaction/fx/transactionTransitionFx";
import type { TransactionEntrySchema } from "~/user-transaction-entry/schema/TransactionEntry";

const INSERT_CHUNK_SIZE = 1_000;

export const withExpiresAtCronFx = Effect.fn("withExpiresAtCronFx")(function* () {
	const logger = yield* getLoggerFx("withExpiresAtCronFx", "cron");
	logger.trace("withExpiresAtCronFx");

	yield* withTransactionFx(
		Effect.gen(function* () {
			const dateContext = yield* DateServiceFx;
			const now = dateContext.nowFn().toJSDate();
			const { kysely } = yield* KyselyContextFx;

			const sourceQuery = kysely
				.selectFrom("transaction as t")
				.where("t.status", "in", Transitions.LiveStatus)
				.where("t.expiresAt", "<=", now)
				.orderBy("t.expiresAt", "asc")
				.orderBy("t.id", "asc")
				.limit(50_000);

			const transactions = yield* dbFx(async () => {
				return sourceQuery
					.innerJoin("listing as l", "l.id", "t.listingId")
					.select([
						"t.id",
						"t.listingId",
						"t.userId as buyerId",
						"l.userId as sellerId",
					])
					.execute();
			});

			if (transactions.length === 0) {
				return;
			}

			const envelopes = transactions.map((transaction) => ({
				transaction,
				transactionEntry: {
					id: genIdFn(),
					transactionId: transaction.id,
					kind: "status-expired",
					userId: null,
					payload: {
						text: "status-expired",
					},
					createdAt: now,
				} satisfies Partial<TransactionEntrySchema.Type>,
			}));

			yield* dbFx(async (kysely) => {
				return kysely
					.deleteFrom("transaction_entry")
					.where("transactionId", "in", sourceQuery.select("t.id"))
					.where("kind", "in", TransactionEntrySensitiveKindEnumSchema.options)
					.executeTakeFirst();
			});

			yield* dbFx(async (kysely) => {
				return kysely
					.updateTable("transaction")
					.set({
						status: "expired",
						statusUpdatedAt: now,
						updatedAt: now,
					})
					.where("id", "in", sourceQuery.select("t.id"))
					.execute();
			});

			const entries = envelopes.map(({ transactionEntry }) => transactionEntry);

			const activities = envelopes.flatMap(({ transaction, transactionEntry }) => {
				return [
					{
						id: genIdFn(),
						userId: transaction.sellerId,
						reference: [
							transaction.listingId,
							transaction.id,
						],
						family: "transaction",
						type: "system",
						payload: {
							transactionId: transaction.id,
							listingId: transaction.listingId,
							transactionEntryId: transactionEntry.id,
							target: "seller",
						},
						priority: "high",
						timestamp: now,
						archivedAt: null,
					} satisfies ActivityTableSchema.Type,
					{
						id: genIdFn(),
						userId: transaction.buyerId,
						reference: [
							transaction.listingId,
							transaction.id,
						],
						family: "transaction",
						type: "system",
						payload: {
							transactionId: transaction.id,
							listingId: transaction.listingId,
							transactionEntryId: transactionEntry.id,
							target: "buyer" as const,
						},
						priority: "high",
						timestamp: now,
						archivedAt: null,
					} satisfies ActivityTableSchema.Type,
				];
			});

			const insertEntriesFx = Effect.forEach(
				Chunk.chunksOf(Chunk.fromIterable(entries), INSERT_CHUNK_SIZE),
				(chunk) => {
					return dbFx(async (kysely) => {
						return kysely
							.insertInto("transaction_entry")
							.values(Chunk.toReadonlyArray(chunk))
							.execute();
					});
				},
				{
					concurrency: 2,
				},
			);

			const insertActivitiesFx = Effect.forEach(
				Chunk.chunksOf(Chunk.fromIterable(activities), INSERT_CHUNK_SIZE),
				(chunk) => {
					return dbFx(async (kysely) => {
						return kysely
							.insertInto("activity")
							.values(Chunk.toReadonlyArray(chunk))
							.execute();
					});
				},
				{
					concurrency: 2,
				},
			);

			yield* Effect.all(
				[
					insertEntriesFx,
					insertActivitiesFx,
				],
				{
					concurrency: 2,
				},
			);
		}),
	);
});

export type withExpiresAtCronFx = ReturnType<typeof withExpiresAtCronFx>;
