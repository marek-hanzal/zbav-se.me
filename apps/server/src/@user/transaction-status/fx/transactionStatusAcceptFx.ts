import { Effect } from "effect";
import { transactionPatchFx } from "~/@user/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionStatusCreateFx } from "~/@user/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusAcceptSchema } from "~/@user/transaction-status/schema/TransactionStatusAcceptSchema";

export namespace transactionStatusAcceptFx {
	export type Props = TransactionStatusAcceptSchema.Type;
}

export const transactionStatusAcceptFx = ({
	messageThreadId,
}: transactionStatusAcceptFx.Props) => {
	return Effect.gen(function* () {
		const transaction = yield* transactionResolveFx({
			messageThreadId,
			message: "You are not allowed to accept this listing transaction",
		});

		yield* transactionPatchFx({
			messageThreadId: transaction.messageThreadId,
		});

		return yield* transactionStatusCreateFx({
			messageThreadId: transaction.messageThreadId,
			status: "accepted",
			side: transaction.side,
		});
	});
};

export type transactionStatusAcceptFx = ReturnType<typeof transactionStatusAcceptFx>;
