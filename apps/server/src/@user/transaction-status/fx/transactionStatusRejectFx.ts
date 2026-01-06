import { Effect } from "effect";
import type { DateTime } from "luxon";
import { messageSystemCreateFx } from "~/@user/message-system/fx/messageSystemCreateFx";
import { transactionPatchFx } from "~/@user/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionStatusCreateFx } from "~/@user/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusRejectSchema } from "~/@user/transaction-status/schema/TransactionStatusRejectSchema";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace transactionStatusRejectFx {
	export interface Props extends TransactionStatusRejectSchema.Type {
		createdAt?: DateTime;
	}
}

export const transactionStatusRejectFx = Effect.fn("transactionStatusRejectFx")(function* ({
	transactionId,
	createdAt,
}: transactionStatusRejectFx.Props) {
	const user = yield* UserContextFx;

	const transaction = yield* transactionResolveFx({
		transactionId,
		message: "You are not allowed to reject this listing transaction",
	});

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
		message:
			transaction.side === "buyer"
				? "Buyer rejected the transaction (message)"
				: "Seller rejected the transaction (message)",
		createdAt,
	});

	yield* userInteractionEventFx({
		userId: user.id,
		targetId: transaction.buyerId,
		source: "transaction",
		group: transaction.id,
		event: "transaction.rejected",
		isTerminal: true,
	});

	return yield* transactionStatusCreateFx({
		transactionId: transaction.id,
		listingId: transaction.listingId,
		status: "rejected",
		side: transaction.side,
		createdAt,
	});
});

export type transactionStatusRejectFx = ReturnType<typeof transactionStatusRejectFx>;
