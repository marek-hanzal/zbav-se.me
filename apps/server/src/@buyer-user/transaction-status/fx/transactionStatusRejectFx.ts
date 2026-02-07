import { Effect } from "effect";
import { transactionPatchFx } from "~/@buyer-user/transaction/fx/transactionPatchFx";
import { transactionStatusCreateFx } from "~/@buyer-user/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusRejectSchema } from "~/@common/transaction-status/schema/TransactionStatusRejectSchema";
import { messageSystemCreateFx } from "~/@user/message-system/fx/messageSystemCreateFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";

export namespace transactionStatusRejectFx {
	export interface Props extends TransactionStatusRejectSchema.Type {
		userId: string;
	}
}

export const transactionStatusRejectFx = Effect.fn("transactionStatusRejectFx")(function* ({
	userId,
	transactionId,
}: transactionStatusRejectFx.Props) {
	yield* Effect.annotateLogsScoped({
		"transactionStatusRejectFx.userId": userId,
		"transactionStatusRejectFx.transactionId": transactionId,
	});

	const transaction = yield* transactionResolveFx({
		userId,
		transactionId,
		message: "You are not allowed to reject this listing transaction",
	});

	if (transaction.side !== "buyer") {
		return yield* new InvalidRequestError({
			message: "Only buyer can reject a transaction from buyer-user endpoint",
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
		text: "Buyer rejected the transaction (message)",
	});

	yield* userInteractionEventFx({
		userId,
		targetId: transaction.sellerId,
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
