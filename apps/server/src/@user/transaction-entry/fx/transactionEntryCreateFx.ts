import { Effect } from "effect";
import { match } from "ts-pattern";
import { galleryInsertFx } from "~/@user/gallery/fx/galleryInsertFx";
import { galleryItemInsertFx } from "~/@user/gallery-item/fx/galleryItemInsertFx";
import { inboxCreateFx } from "~/@user/inbox/fx/inboxCreateFx";
import type { InboxCreateSchema } from "~/@user/inbox/schema/InboxCreateSchema";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionTransitionFx } from "~/@user/transaction/fx/transactionTransitionFx";
import { createTransactionEntryFx } from "~/@user/transaction-entry/fx/createTransactionEntryFx";
import type { TransactionEntryCreateSchema } from "~/@user/transaction-entry/schema/TransactionEntryCreateSchema";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { InvalidRequestErrorFx } from "~/error/InvalidRequestErrorFx";

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
	const transaction = yield* transactionResolveFx({
		userId,
		transactionId,
	});

	yield* transactionTransitionFx({
		status: transaction.status,
		request: "message",
		side: transaction.side,
	});

	yield* userInteractionEventFx({
		userId,
		targetId: transaction.side === "buyer" ? transaction.sellerId : transaction.buyerId,
		source: "transaction",
		group: transaction.id,
		event: "transaction.message",
		isTerminal: false,
	});

	yield* inboxCreateFx(
		match(transaction.side)
			.with(
				"buyer",
				(): InboxCreateSchema.Type => ({
					userId: transaction.sellerId,
					family: "message",
					type: "buyer-message",
					payload: {
						type: "buyer-message",
						transactionId: transaction.id,
					},
					priority: "high",
				}),
			)
			.otherwise(
				(): InboxCreateSchema.Type => ({
					userId: transaction.buyerId,
					family: "message",
					type: "seller-message",
					payload: {
						type: "seller-message",
						transactionId: transaction.id,
					},
					priority: "high",
				}),
			),
	);

	return yield* match(entry)
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
});
