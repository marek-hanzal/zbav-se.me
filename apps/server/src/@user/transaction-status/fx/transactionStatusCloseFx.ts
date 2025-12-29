import { Effect } from "effect";
import { messageSystemCreateFx } from "~/@user/message-system/fx/messageSystemCreateFx";
import { transactionPatchFx } from "~/@user/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionStatusCreateFx } from "~/@user/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusCloseSchema } from "~/@user/transaction-status/schema/TransactionStatusCloseSchema";

export namespace transactionStatusCloseFx {
	export type Props = TransactionStatusCloseSchema.Type;
}

export const transactionStatusCloseFx = ({ transactionId }: transactionStatusCloseFx.Props) => {
	return Effect.gen(function* () {
		const transaction = yield* transactionResolveFx({
			transactionId,
			message: "You are not allowed to close this listing transaction",
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
					? "Buyer closed the transaction (message)"
					: "Seller closed the transaction (message)",
		});

		return yield* transactionStatusCreateFx({
			transactionId: transaction.id,
			status: "closed",
			side: transaction.side,
		});
	});
};

export type transactionStatusCloseFx = ReturnType<typeof transactionStatusCloseFx>;
