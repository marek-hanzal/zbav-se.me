import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import type { ActivityTableSchema } from "~/server/database/@table/ActivityTableSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { Transitions } from "~/user/transaction/server/fx/transactionTransitionFx";
import type { TransactionEntrySchema } from "~/user/transaction-entry/server/schema/TransactionEntrySchema";

export const withExpiresAtCronFx = Effect.fn("withExpiresAtCronFx")(function* () {
	const logger = yield* getLoggerFx("withExpiresAtCronFx", "cron");
	logger.trace("withExpiresAtCronFx");

	yield* withTransactionFx(
		Effect.gen(function* () {
			const dateContext = yield* DateContextFx;
			const now = dateContext.now().toJSDate();
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

			const transactionEnvelopes = transactions.map((transaction) => ({
				transaction,
				transactionEntry: {
					id: genId(),
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
					.updateTable("transaction")
					.set({
						status: "expired",
						statusUpdatedAt: now,
						updatedAt: now,
					})
					.where("id", "in", sourceQuery.select("t.id"))
					.execute();
			});

			yield* dbFx(async (kysely) => {
				return kysely
					.insertInto("transaction_entry")
					.values(
						transactionEnvelopes.map(({ transactionEntry }) => {
							return transactionEntry;
						}),
					)
					.execute();
			});

			yield* dbFx(async (kysely) => {
				return kysely
					.insertInto("activity")
					.values(
						transactionEnvelopes.flatMap(({ transaction, transactionEntry }) => {
							return [
								{
									id: genId(),
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
									id: genId(),
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
						}),
					)
					.execute();
			});
		}),
	);
});

export type withExpiresAtCronFx = ReturnType<typeof withExpiresAtCronFx>;
