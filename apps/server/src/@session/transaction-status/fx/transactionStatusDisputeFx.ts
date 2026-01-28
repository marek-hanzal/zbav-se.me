import { Effect } from "effect";
import { transactionPatchFx } from "~/@buyer-user/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/@buyer-user/transaction/fx/transactionResolveFx";
import { transactionStatusCreateFx } from "~/@session/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusDisputeSchema } from "~/@session/transaction-status/schema/TransactionStatusDisputeSchema";
import { messageSystemCreateFx } from "~/@user/message-system/fx/messageSystemCreateFx";

export namespace transactionStatusDisputeFx {
	export interface Props extends TransactionStatusDisputeSchema.Type {
		userId: string;
	}
}

export const transactionStatusDisputeFx = Effect.fn("transactionStatusDisputeFx")(function* ({
	userId,
	transactionId,
}: transactionStatusDisputeFx.Props) {
	const transaction = yield* transactionResolveFx({
		userId,
		transactionId,
		message: "You are not allowed to dispute this listing transaction",
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
		text: "Transaction dispute (message)",
	});

	return yield* transactionStatusCreateFx({
		userId,
		transactionId: transaction.id,
		listingId: transaction.listingId,
		status: "dispute",
		side: transaction.side,
	});
});

export type transactionStatusDisputeFx = ReturnType<typeof transactionStatusDisputeFx>;
