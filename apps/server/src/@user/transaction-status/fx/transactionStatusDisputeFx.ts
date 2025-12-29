import { Effect } from "effect";
import { messageSystemCreateFx } from "~/@user/message-system/fx/messageSystemCreateFx";
import { transactionPatchFx } from "~/@user/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionStatusCreateFx } from "~/@user/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusDisputeSchema } from "~/@user/transaction-status/schema/TransactionStatusDisputeSchema";

export namespace transactionStatusDisputeFx {
	export type Props = TransactionStatusDisputeSchema.Type;
}

export const transactionStatusDisputeFx = ({ transactionId }: transactionStatusDisputeFx.Props) => {
	return Effect.gen(function* () {
		const transaction = yield* transactionResolveFx({
			transactionId,
			message: "You are not allowed to dispute this listing transaction",
		});

		yield* transactionPatchFx({
			patch: {},
			query: {
				where: {
					id: transaction.id,
				},
			},
		});

		yield* messageSystemCreateFx({
			messageThreadId: transaction.messageThreadId,
			message:
				transaction.side === "buyer"
					? "Buyer disputed the transaction (message)"
					: "Seller disputed the transaction (message)",
		});

		return yield* transactionStatusCreateFx({
			transactionId: transaction.id,
			status: "dispute",
			side: transaction.side,
		});
	});
};

export type transactionStatusDisputeFx = ReturnType<typeof transactionStatusDisputeFx>;
