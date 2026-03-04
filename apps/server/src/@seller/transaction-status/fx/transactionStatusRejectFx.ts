import { Effect } from "effect";
import type { TransactionStatusRejectSchema } from "~/@common/transaction-status/schema/TransactionStatusRejectSchema";
import { transactionPatchFx } from "~/@seller/transaction/fx/transactionPatchFx";
import { transactionStatusCreateFx } from "~/@seller/transaction-status/fx/transactionStatusCreateFx";
import { inboxCreateFx } from "~/@user/inbox/fx/inboxCreateFx";
import { messageSystemCreateFx } from "~/@user/message-system/fx/messageSystemCreateFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { withTraceFx } from "~/effect/withTraceFx";
import { InvalidRequestErrorFx } from "~/error/InvalidRequestErrorFx";

export namespace transactionStatusRejectFx {
	export interface Props extends TransactionStatusRejectSchema.Type {
		userId: string;
	}
}

export const transactionStatusRejectFx = Effect.fn("transactionStatusRejectFx")(function* ({
	userId,
	transactionId,
}: transactionStatusRejectFx.Props) {
	yield* withTraceFx({
		fx: "transactionStatusRejectFx",
		input: {
			userId,
			transactionId,
		},
	});

	const transaction = yield* transactionResolveFx({
		userId,
		transactionId,
		message: "You are not allowed to reject this listing transaction",
	});

	if (transaction.side !== "seller") {
		yield* withTraceFx({
			fx: "transactionStatusRejectFx",
			error: {
				message: "Only seller can reject a transaction from seller endpoint",
			},
		});
		return yield* new InvalidRequestErrorFx({
			message: "Only seller can reject a transaction from seller endpoint",
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
		text: "Seller rejected the transaction (message)",
	});

	yield* inboxCreateFx({
		userId: transaction.buyerId,
		type: "seller-message",
		payload: {
			type: "seller-message",
			transactionId: transaction.id,
			listingId: transaction.listingId,
			messageThreadId: transaction.messageThreadId,
		},
		priority: "high",
	});

	yield* userInteractionEventFx({
		userId,
		targetId: transaction.buyerId,
		source: "transaction",
		group: transaction.id,
		event: "transaction.rejected",
		isTerminal: true,
	});

	return yield* transactionStatusCreateFx({
		userId,
		transactionId: transaction.id,
		listingId: transaction.listingId,
		status: "rejected",
		side: transaction.side,
	});
});

export type transactionStatusRejectFx = ReturnType<typeof transactionStatusRejectFx>;
