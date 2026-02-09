import { Effect } from "effect";
import type { TransactionStatusDisputeSchema } from "~/@common/transaction-status/schema/TransactionStatusDisputeSchema";
import { transactionPatchFx } from "~/@seller-user/transaction/fx/transactionPatchFx";
import { transactionStatusCreateFx } from "~/@seller-user/transaction-status/fx/transactionStatusCreateFx";
import { messageSystemCreateFx } from "~/@user/message-system/fx/messageSystemCreateFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { withTraceFx } from "~/effect/withTraceFx";
import { InvalidRequestErrorFx } from "~/error/InvalidRequestErrorFx";

export namespace transactionStatusDisputeFx {
	export interface Props extends TransactionStatusDisputeSchema.Type {
		userId: string;
	}
}

export const transactionStatusDisputeFx = Effect.fn("transactionStatusDisputeFx")(function* ({
	userId,
	transactionId,
}: transactionStatusDisputeFx.Props) {
	yield* withTraceFx({
		fx: "transactionStatusDisputeFx",
		input: {
			userId,
			transactionId,
		},
	});

	const transaction = yield* transactionResolveFx({
		userId,
		transactionId,
		message: "You are not allowed to dispute this listing transaction",
	});

	if (transaction.side !== "seller") {
		yield* withTraceFx({
			fx: "transactionStatusDisputeFx",
			error: {
				message: "Only seller can dispute a transaction from seller-user endpoint",
			},
		});
		return yield* new InvalidRequestErrorFx({
			message: "Only seller can dispute a transaction from seller-user endpoint",
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
		text: "Seller disputed the transaction (message)",
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
