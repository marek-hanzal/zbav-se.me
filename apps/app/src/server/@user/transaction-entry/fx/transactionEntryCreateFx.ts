import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { match } from "ts-pattern";
import { galleryInsertFx } from "~/server/@user/gallery/fx/galleryInsertFx";
import { galleryItemInsertFx } from "~/server/@user/gallery-item/fx/galleryItemInsertFx";
import { inboxCreateFx } from "~/server/@user/inbox/fx/inboxCreateFx";
import { transactionResolveFx } from "~/server/@user/transaction/fx/transactionResolveFx";
import { transactionTouchFx } from "~/server/@user/transaction/fx/transactionTouchFx";
import { transactionTransitionFx } from "~/server/@user/transaction/fx/transactionTransitionFx";
import { transactionEntryFetchFx } from "~/server/@user/transaction-entry/fx/transactionEntryFetchFx";
import type { TransactionEntryCreateSchema } from "~/server/@user/transaction-entry/schema/TransactionEntryCreateSchema";
import { userInteractionEventFx } from "~/server/@user/user-event/fx/userInteractionEventFx";
import type { TransactionEntryTableSchema } from "~/server/database/@table/TransactionEntryTableSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { InvalidRequestErrorFx } from "~/server/error/InvalidRequestErrorFx";

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
				const { kysely } = yield* KyselyContextFx;
				const dateContext = yield* DateContextFx;
				const id = genId();

				yield* transactionTransitionFx({
					status: transaction.status,
					request: kind,
					side: transaction.side,
				});

				yield* tryDbFx(async () =>
					kysely
						.insertInto("transaction_entry")
						.values({
							...data,
							id,
							kind,
							createdAt: dateContext.now().toJSDate(),
						})
						.executeTakeFirstOrThrow(),
				);

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
							userId,
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
						kind: "status-open",
					},
					{
						kind: "status-pending",
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

			yield* match(transaction.side)
				.with("buyer", () =>
					inboxCreateFx({
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
					}),
				)
				.with("seller", () =>
					inboxCreateFx({
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
					}),
				)
				.with("transaction", () =>
					Effect.all([
						inboxCreateFx({
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
						inboxCreateFx({
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
					]).pipe(Effect.asVoid),
				)
				.with("system", () =>
					Effect.all([
						inboxCreateFx({
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
						inboxCreateFx({
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
					]).pipe(Effect.asVoid),
				)
				.otherwise(() => Effect.void);

			return transactionEntry;
		}),
	);
});
