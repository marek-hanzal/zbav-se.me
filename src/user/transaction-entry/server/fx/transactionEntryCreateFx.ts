import { Effect } from "effect";
import { match } from "ts-pattern";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import type { TransactionEntryTableSchema } from "~/server/database/@table/TransactionEntryTableSchema";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { InvalidRequestErrorFx } from "~/server/error/InvalidRequestErrorFx";
import { activityCreateFx } from "~/user/activity/server/fx/activityCreateFx";
import { galleryInsertFx } from "~/user/gallery/server/fx/galleryInsertFx";
import { galleryItemInsertFx } from "~/user/gallery-item/server/fx/galleryItemInsertFx";
import { transactionMessageActivityArchiveFx } from "~/user/transaction/server/fx/transactionMessageActivityArchiveFx";
import { transactionResolveFx } from "~/user/transaction/server/fx/transactionResolveFx";
import { transactionTouchFx } from "~/user/transaction/server/fx/transactionTouchFx";
import { transactionTransitionFx } from "~/user/transaction/server/fx/transactionTransitionFx";
import { transactionEntryFetchFx } from "~/user/transaction-entry/server/fx/transactionEntryFetchFx";
import type { TransactionEntryCreateSchema } from "~/user/transaction-entry/server/schema/TransactionEntryCreateSchema";
import { userInteractionEventFx } from "~/user/user-event/server/fx/userInteractionEventFx";

export namespace transactionEntryCreateFx {
	export interface UserProps {
		userId: string;
	}

	export type Props = TransactionEntryCreateSchema.Type & UserProps;
}

export const transactionEntryCreateFx = Effect.fn("transactionEntryCreateFx")(function* ({
	userId,
	transactionId,
	...entry
}: transactionEntryCreateFx.Props) {
	const logger = yield* getLoggerFx("transactionEntryCreateFx", "transaction-entry");
	logger.trace("transactionEntryCreateFx", {
		userId,
		transactionId,
		...entry,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const createTransactionEntryFx = Effect.fn("createTransactionEntryFx")(function* ({
				scopeUserId,
				kind,
				...data
			}: Pick<
				TransactionEntryTableSchema.Type,
				"transactionId" | "kind" | "userId" | "payload"
			> & {
				scopeUserId: string;
			}) {
				const dateContext = yield* DateContextFx;
				const id = genId();

				yield* transactionTransitionFx({
					status: transaction.status,
					request: kind,
					side: transaction.side,
				});

				yield* dbFx(async (kysely) => {
					return kysely
						.insertInto("transaction_entry")
						.values({
							...data,
							id,
							kind,
							createdAt: dateContext.now().toJSDate(),
						})
						.executeTakeFirstOrThrow();
				});

				yield* transactionTouchFx({
					transactionId,
					userId: scopeUserId,
				});

				return yield* transactionEntryFetchFx({
					userId: scopeUserId,
					where: {
						id,
					},
				});
			});

			const transaction = yield* transactionResolveFx({
				userId,
				transactionId,
			});

			yield* match(transaction.side)
				.with("buyer", () => {
					return transactionMessageActivityArchiveFx({
						listingId: transaction.listingId,
						transactionId: transaction.id,
						type: "seller-message",
						userId,
					});
				})
				.with("seller", () => {
					return transactionMessageActivityArchiveFx({
						listingId: transaction.listingId,
						transactionId: transaction.id,
						type: "buyer-message",
						userId,
					});
				})
				.otherwise(() => Effect.void);

			/**
			 * We intentionally keep these side effects before the actual write/transition gate.
			 * We know this is not ideal, but the current behavior is relied on and will be
			 * revisited separately once transaction entry writes get their own dedicated flow.
			 */
			yield* userInteractionEventFx({
				userId,
				targetId: transaction.side === "buyer" ? transaction.sellerId : transaction.buyerId,
				source: "transaction",
				group: transaction.id,
				event: "transaction.message",
				isTerminal: false,
			});

			const transactionEntry = yield* match(entry)
				.with(
					{
						kind: "text",
					},
					({ payload }) => {
						return createTransactionEntryFx({
							transactionId,
							kind: "text",
							userId,
							payload,
							scopeUserId: userId,
						});
					},
				)
				.with(
					{
						kind: "location",
					},
					({ payload }) => {
						return createTransactionEntryFx({
							transactionId,
							kind: "location",
							userId,
							payload,
							scopeUserId: userId,
						});
					},
				)
				.with(
					{
						kind: "package",
					},
					({ payload }) => {
						return createTransactionEntryFx({
							transactionId,
							kind: "package",
							userId,
							payload,
							scopeUserId: userId,
						});
					},
				)
				.with(
					{
						kind: "personal",
					},
					({ payload }) => {
						return createTransactionEntryFx({
							transactionId,
							kind: "personal",
							userId,
							payload,
							scopeUserId: userId,
						});
					},
				)
				.with(
					{
						kind: "gallery",
					},
					function* ({ payload }) {
						if (payload.uploadIds.length === 0) {
							return yield* new InvalidRequestErrorFx({
								message: "At least one upload is required",
							});
						}

						const gallery = yield* galleryInsertFx({
							access: "protected",
							userId,
						});

						yield* dbFx(async (kysely) => {
							return kysely
								.updateTable("upload")
								.set({
									access: "protected",
								})
								.where("userId", "=", userId)
								.where("id", "in", payload.uploadIds)
								.execute();
						});

						let sort = 0;
						for (const uploadId of payload.uploadIds) {
							yield* galleryItemInsertFx({
								galleryId: gallery.id,
								uploadId,
								sort,
								userId,
								check: false,
							});
							sort++;
						}

						return yield* createTransactionEntryFx({
							transactionId,
							kind: "gallery",
							userId,
							payload: {
								galleryId: gallery.id,
							},
							scopeUserId: userId,
						});
					},
				)
				// common
				.with(
					{
						kind: "status-trade",
					},
					{
						kind: "status-interest",
					},
					{
						kind: "status-resolved",
					},
					{
						kind: "status-rejected-buyer",
					},
					{
						kind: "status-rejected-seller",
					},
					{
						kind: "status-dispute-buyer",
					},
					{
						kind: "status-dispute-seller",
					},
					{
						kind: "status-expired",
					},
					{
						kind: "status-success",
					},
					{
						kind: "status-closed",
					},
					{
						kind: "status-sold",
					},
					({ kind, payload }) => {
						return createTransactionEntryFx({
							transactionId,
							kind,
							userId,
							payload,
							scopeUserId: userId,
						});
					},
				)
				.exhaustive();

			/**
			 * Create counterparty activity as an explicit, controlled side effect.
			 *
			 * Persisting a transaction entry does not automatically mean the other side
			 * should be notified. Most user-authored entries produce unread activity for
			 * the counterparty, but the buyer-side `interest` text buffer is intentionally
			 * different: it is stored for the buyer and later revealed after `trade`,
			 * without pinging or leaking anything to the seller while the transaction is
			 * still only an interest.
			 *
			 * Keep this effect lazy so the notification branch is not constructed or
			 * executed until the visibility/anti-spam gate below decides that counterparty
			 * activity is actually allowed.
			 */
			const createCounterpartyActivityFx = Effect.suspend(() => {
				return match(transaction.side)
					.with("buyer", () => {
						return activityCreateFx({
							userId: transaction.sellerId,
							reference: [
								transaction.listingId,
								transaction.id,
							],
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: transaction.id,
								transactionEntryId: transactionEntry.id,
							},
							priority: "high",
						});
					})
					.with("seller", () => {
						return activityCreateFx({
							userId: transaction.buyerId,
							reference: [
								transaction.listingId,
								transaction.id,
							],
							family: "transaction",
							type: "seller-message",
							payload: {
								transactionId: transaction.id,
								transactionEntryId: transactionEntry.id,
							},
							priority: "high",
						});
					})
					.with("transaction", () => {
						return Effect.all([
							activityCreateFx({
								userId: transaction.sellerId,
								reference: [
									transaction.listingId,
									transaction.id,
								],
								family: "transaction",
								type: "transaction",
								payload: {
									transactionId: transaction.id,
									listingId: transaction.listingId,
									transactionEntryId: transactionEntry.id,
									target: "seller",
								},
								priority: "high",
							}),
							activityCreateFx({
								userId: transaction.buyerId,
								reference: [
									transaction.listingId,
									transaction.id,
								],
								family: "transaction",
								type: "transaction",
								payload: {
									transactionId: transaction.id,
									listingId: transaction.listingId,
									transactionEntryId: transactionEntry.id,
									target: "buyer",
								},
								priority: "high",
							}),
						]).pipe(Effect.asVoid);
					})
					.with("system", () => {
						return Effect.all([
							activityCreateFx({
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
							}),
							activityCreateFx({
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
									target: "buyer",
								},
								priority: "high",
							}),
						]).pipe(Effect.asVoid);
					})
					.otherwise(() => Effect.void);
			});

			yield* Effect.if(transaction.status === "interest" && transaction.side === "buyer", {
				onTrue() {
					return Effect.void;
				},
				onFalse() {
					return createCounterpartyActivityFx;
				},
			});

			return transactionEntry;
		}),
	);
});

export type transactionEntryCreateFx = ReturnType<typeof transactionEntryCreateFx>;
