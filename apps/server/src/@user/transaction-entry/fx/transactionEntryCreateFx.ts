import { Effect } from "effect";
import { match } from "ts-pattern";
import { galleryInsertFx } from "~/@user/gallery/fx/galleryInsertFx";
import { galleryItemInsertFx } from "~/@user/gallery-item/fx/galleryItemInsertFx";
import { inboxCreateFx } from "~/@user/inbox/fx/inboxCreateFx";
import type { InboxCreateSchema } from "~/@user/inbox/schema/InboxCreateSchema";
import { transactionEntryAppendFx } from "~/@user/transaction-entry/fx/transactionEntryAppendFx";
import type { TransactionEntryCreateSchema } from "~/@user/transaction-entry/schema/TransactionEntryCreateSchema";
import { transactionTransitionFx } from "~/@user/transaction/fx/transactionTransitionFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { InvalidRequestErrorFx } from "~/error/InvalidRequestErrorFx";

export namespace transactionEntryCreateFx {
	export interface UserProps {
		userId: string;
	}

	export type Props = TransactionEntryCreateSchema.Type & UserProps;
}

export const transactionEntryCreateFx = Effect.fn("transactionEntryCreateFx")(function* (
	props: transactionEntryCreateFx.Props,
) {
	const transaction = yield* transactionResolveFx({
		userId: props.userId,
		transactionId: props.transactionId,
	});

	yield* transactionTransitionFx({
		status: transaction.status,
		request: "message",
		side: transaction.side,
	});

	yield* userInteractionEventFx({
		userId: props.userId,
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

	return yield* match(props)
		.with(
			{
				kind: "text",
			},
			(props) =>
				transactionEntryAppendFx({
					transactionId: props.transactionId,
					kind: "text",
					userId: props.userId,
					payload: props.payload,
					scopeUserId: props.userId,
				}),
		)
		.with(
			{
				kind: "location",
			},
			(props) =>
				transactionEntryAppendFx({
					transactionId: props.transactionId,
					kind: "location",
					userId: props.userId,
					payload: props.payload,
					scopeUserId: props.userId,
				}),
		)
		.with(
			{
				kind: "package",
			},
			(props) =>
				transactionEntryAppendFx({
					transactionId: props.transactionId,
					kind: "package",
					userId: props.userId,
					payload: props.payload,
					scopeUserId: props.userId,
				}),
		)
		.with(
			{
				kind: "personal",
			},
			(props) =>
				transactionEntryAppendFx({
					transactionId: props.transactionId,
					kind: "personal",
					userId: props.userId,
					payload: props.payload,
					scopeUserId: props.userId,
				}),
		)
		.with(
			{
				kind: "gallery",
			},
			function* (props) {
				if (props.payload.uploadIds.length === 0) {
					return yield* new InvalidRequestErrorFx({
						message: "At least one upload is required",
					});
				}

				const gallery = yield* galleryInsertFx({
					userId: props.userId,
				});

				let sort = 0;
				for (const uploadId of props.payload.uploadIds) {
					yield* galleryItemInsertFx({
						galleryId: gallery.id,
						uploadId,
						sort,
						userId: props.userId,
						check: false,
					});
					sort++;
				}

				return yield* transactionEntryAppendFx({
					transactionId: props.transactionId,
					kind: "gallery",
					userId: props.userId,
					payload: {
						galleryId: gallery.id,
					},
					scopeUserId: props.userId,
				});
			},
		)
		.exhaustive();
});
