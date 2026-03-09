import { Effect } from "effect";
import { transactionStatusCreateFx } from "~/@seller/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusAcceptSchema } from "~/@seller/transaction-status/schema/TransactionStatusAcceptSchema";
import { inboxCreateFx } from "~/@user/inbox/fx/inboxCreateFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { traceLogFx } from "~/effect/traceLogFx";
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
	yield* traceLogFx({
		level: "trace",
		message: "transactionStatusAcceptFx",
		input: {
			userId,
			transactionId,
		},
	});

	const transaction = yield* transactionResolveFx({
		userId,
		transactionId,
		message: "You are not allowed to accept this listing transaction",
	});

	if (transaction.side === "buyer") {
		yield* traceLogFx({
			level: "trace",
			message: "transactionStatusAcceptFx",
			error: {
				message: "Buyer cannot accept a transaction",
			},
		});
		return yield* new RuntimeErrorFx({
			message: "Buyer cannot accept a transaction",
		});
	}
	if (transaction.status !== "pending") {
		yield* traceLogFx({
			level: "trace",
			message: "transactionStatusAcceptFx",
			error: {
				message: `Transaction must be pending before accept, got ${transaction.status}`,
			},
		});
		return yield* new RuntimeErrorFx({
			message: "Transaction must be pending before accept",
		});
	}

	yield* inboxCreateFx({
		userId: transaction.buyerId,
		family: "message",
		type: "seller-message",
		payload: {
			type: "seller-message",
			transactionId: transaction.id,
		},
		priority: "high",
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
