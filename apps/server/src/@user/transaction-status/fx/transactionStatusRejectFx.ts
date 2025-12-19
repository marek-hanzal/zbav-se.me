import { Effect } from "effect";
import { messageSystemCreateFx } from "~/@user/message-system/fx/messageSystemCreateFx";
import { transactionPatchFx } from "~/@user/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionStatusCreateFx } from "~/@user/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusRejectSchema } from "~/@user/transaction-status/schema/TransactionStatusRejectSchema";

export namespace transactionStatusRejectFx {
	export type Props = TransactionStatusRejectSchema.Type;
}

export const transactionStatusRejectFx = ({ transactionId }: transactionStatusRejectFx.Props) => {
	return Effect.gen(function* () {
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
		});

		yield* messageSystemCreateFx({
			messageThreadId: transaction.messageThreadId,
			message:
				transaction.side === "buyer"
					? "Buyer rejected the transaction (message)"
					: "Seller rejected the transaction (message)",
		});

		return yield* transactionStatusCreateFx({
			transactionId: transaction.id,
			status: "rejected",
			side: transaction.side,
		});
	});
};

export type transactionStatusRejectFx = ReturnType<typeof transactionStatusRejectFx>;
