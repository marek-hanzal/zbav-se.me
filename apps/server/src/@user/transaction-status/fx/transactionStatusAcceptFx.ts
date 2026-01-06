import { Effect } from "effect";
import type { DateTime } from "luxon";
import { messageSystemCreateFx } from "~/@user/message-system/fx/messageSystemCreateFx";
import { transactionPatchFx } from "~/@user/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionStatusCreateFx } from "~/@user/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusAcceptSchema } from "~/@user/transaction-status/schema/TransactionStatusAcceptSchema";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { RuntimeError } from "~/error/RuntimeError";

export namespace transactionStatusAcceptFx {
	export interface Props extends TransactionStatusAcceptSchema.Type {
		createdAt?: DateTime;
	}
}

export const transactionStatusAcceptFx = Effect.fn("transactionStatusAcceptFx")(function* ({
	transactionId,
	createdAt,
}: transactionStatusAcceptFx.Props) {
	const user = yield* UserContextFx;

	const transaction = yield* transactionResolveFx({
		transactionId,
		message: "You are not allowed to accept this listing transaction",
	});

	if (transaction.side === "buyer") {
		return yield* new RuntimeError({
			message: "Buyer cannot accept a transaction",
		});
	}

	yield* transactionPatchFx({
		patch: {},
		query: {
			where: {
				id: transaction.id,
			},
		},
		updatedAt: createdAt,
	});

	yield* messageSystemCreateFx({
		messageThreadId: transaction.messageThreadId,
		message: "Seller accepted the transaction (message)",
		createdAt,
	});

	yield* userInteractionEventFx({
		userId: user.id,
		targetId: transaction.buyerId,
		source: "transaction",
		group: transaction.id,
		event: "transaction.open",
		isTerminal: false,
	});

	return yield* transactionStatusCreateFx({
		transactionId: transaction.id,
		listingId: transaction.listingId,
		status: "open",
		side: transaction.side,
		createdAt,
	});
});

export type transactionStatusAcceptFx = ReturnType<typeof transactionStatusAcceptFx>;
