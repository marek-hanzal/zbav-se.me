import { Effect } from "effect";
import { transactionStatusCreateFx } from "~/@session/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusAcceptSchema } from "~/@session/transaction-status/schema/TransactionStatusAcceptSchema";
import { messageSystemCreateFx } from "~/@user/message-system/fx/messageSystemCreateFx";
import { transactionPatchFx } from "~/@buyer-user/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/@buyer-user/transaction/fx/transactionResolveFx";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { RuntimeError } from "~/error/RuntimeError";

export namespace transactionStatusAcceptFx {
	export interface Props extends TransactionStatusAcceptSchema.Type {
		userId: string;
	}
}

export const transactionStatusAcceptFx = Effect.fn("transactionStatusAcceptFx")(function* ({
	userId,
	transactionId,
}: transactionStatusAcceptFx.Props) {
	const transaction = yield* transactionResolveFx({
		userId,
		transactionId,
		message: "You are not allowed to accept this listing transaction",
	});

	if (transaction.side === "buyer") {
		return yield* new RuntimeError({
			message: "Buyer cannot accept a transaction",
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
		text: "Seller accepted the transaction (message)",
	});

	yield* userInteractionEventFx({
		userId,
		targetId: transaction.buyerId,
		source: "transaction",
		group: transaction.id,
		event: "transaction.open",
		isTerminal: false,
	});

	return yield* transactionStatusCreateFx({
		userId,
		transactionId: transaction.id,
		listingId: transaction.listingId,
		status: "open",
		side: transaction.side,
	});
});

export type transactionStatusAcceptFx = ReturnType<typeof transactionStatusAcceptFx>;
