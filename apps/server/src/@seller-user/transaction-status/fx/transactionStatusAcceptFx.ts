import { Effect } from "effect";
import { transactionPatchFx } from "~/@seller-user/transaction/fx/transactionPatchFx";
import { transactionStatusCreateFx } from "~/@seller-user/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusAcceptSchema } from "~/@seller-user/transaction-status/schema/TransactionStatusAcceptSchema";
import { messageSystemCreateFx } from "~/@user/message-system/fx/messageSystemCreateFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { withTraceFx } from "~/effect/withTraceFx";
import { RuntimeErrorFx } from "~/error/RuntimeErrorFx";

export namespace transactionStatusAcceptFx {
	export interface Props extends TransactionStatusAcceptSchema.Type {
		userId: string;
	}
}

export const transactionStatusAcceptFx = Effect.fn("transactionStatusAcceptFx")(function* ({
	userId,
	transactionId,
}: transactionStatusAcceptFx.Props) {
	yield* withTraceFx({
		fx: "transactionStatusAcceptFx",
		input: { userId, transactionId },
	});

	const transaction = yield* transactionResolveFx({
		userId,
		transactionId,
		message: "You are not allowed to accept this listing transaction",
	});

	if (transaction.side === "buyer") {
		yield* withTraceFx({
			fx: "transactionStatusAcceptFx",
			error: { message: "Buyer cannot accept a transaction" },
		});
		return yield* new RuntimeErrorFx({
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
