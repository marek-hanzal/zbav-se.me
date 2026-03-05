import { Effect } from "effect";
import { transactionPatchFx } from "~/@buyer/transaction/fx/transactionPatchFx";
import { transactionStatusCreateFx } from "~/@buyer/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusDisputeSchema } from "~/@common/transaction-status/schema/TransactionStatusDisputeSchema";
import { inboxCreateFx } from "~/@user/inbox/fx/inboxCreateFx";
import { messageSystemCreateFx } from "~/@user/message-system/fx/messageSystemCreateFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { traceLogFx } from "~/effect/traceLogFx";
import { InvalidRequestErrorFx } from "~/error/InvalidRequestErrorFx";

export namespace transactionStatusDisputeFx {
	export interface Props extends TransactionStatusDisputeSchema.Type {
		userId: string;
	}
}

export const transactionStatusDisputeFx = Effect.fn("transactionStatusDisputeFx")(function* ({
	userId,
	transactionId,
}: transactionStatusDisputeFx.Props) {
	yield* traceLogFx({
		level: "trace",
		message: "transactionStatusDisputeFx",
		input: {
			userId,
			transactionId,
		},
	});

	const transaction = yield* transactionResolveFx({
		userId,
		transactionId,
		message: "You are not allowed to dispute this listing transaction",
	});

	if (transaction.side !== "buyer") {
		yield* traceLogFx({
			level: "trace",
			message: "transactionStatusDisputeFx",
			error: {
				message: "Only buyer can dispute a transaction from buyer endpoint",
			},
		});
		return yield* new InvalidRequestErrorFx({
			message: "Only buyer can dispute a transaction from buyer endpoint",
		});
	}

	yield* transactionPatchFx({
		userId,
		patch: {},
		query: {
			where: {
				id: transaction.id,
			},
		},
		scope: {
			userId,
		},
	});

	yield* messageSystemCreateFx({
		userId,
		messageThreadId: transaction.messageThreadId,
		text: "Buyer disputed the transaction (message)",
	});

	yield* inboxCreateFx(
		transaction.side === "buyer"
			? {
					userId: transaction.sellerId,
					type: "buyer-message",
					payload: {
						type: "buyer-message",
						transactionId: transaction.id,
						listingId: transaction.listingId,
						messageThreadId: transaction.messageThreadId,
					},
					priority: "high",
				}
			: {
					userId: transaction.buyerId,
					type: "seller-message",
					payload: {
						type: "seller-message",
						transactionId: transaction.id,
						listingId: transaction.listingId,
						messageThreadId: transaction.messageThreadId,
					},
					priority: "high",
				},
	);

	return yield* transactionStatusCreateFx({
		userId,
		transactionId: transaction.id,
		listingId: transaction.listingId,
		status: "dispute",
		side: transaction.side,
	});
});

export type transactionStatusDisputeFx = ReturnType<typeof transactionStatusDisputeFx>;
