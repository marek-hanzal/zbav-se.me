import { Effect } from "effect";
import { transactionPatchFx } from "~/@buyer-user/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionStatusCreateFx } from "~/@user/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusRejectSchema } from "~/@user/transaction-status/schema/TransactionStatusRejectSchema";
import { messageSystemCreateFx } from "~/@user/message-system/fx/messageSystemCreateFx";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";

export namespace transactionStatusRejectFx {
	export interface Props extends TransactionStatusRejectSchema.Type {
		userId: string;
	}
}

export const transactionStatusRejectFx = Effect.fn("transactionStatusRejectFx")(function* ({
	userId,
	transactionId,
}: transactionStatusRejectFx.Props) {
	const transaction = yield* transactionResolveFx({
		userId,
		transactionId,
		message: "You are not allowed to reject this listing transaction",
	});

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
		text:
			transaction.side === "buyer"
				? "Buyer rejected the transaction (message)"
				: "Seller rejected the transaction (message)",
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
