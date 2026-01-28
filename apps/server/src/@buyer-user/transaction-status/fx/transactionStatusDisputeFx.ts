import { Effect } from "effect";
import { transactionPatchFx } from "~/@user/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionStatusCreateFx } from "~/@user/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusDisputeSchema } from "~/@buyer-user/transaction-status/schema/TransactionStatusDisputeSchema";
import { messageSystemCreateFx } from "~/@user/message-system/fx/messageSystemCreateFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";

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

	if (transaction.side !== "buyer") {
		return yield* new InvalidRequestError({
			message: "Only buyer can dispute a transaction from buyer-user endpoint",
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

	return yield* transactionStatusCreateFx({
		userId,
		transactionId: transaction.id,
		listingId: transaction.listingId,
		status: "dispute",
		side: transaction.side,
	});
});

export type transactionStatusDisputeFx = ReturnType<typeof transactionStatusDisputeFx>;
