import { Effect } from "effect";
import { transactionPatchFx } from "~/@user/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionStatusCreateFx } from "~/@user/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusRejectSchema } from "~/@user/transaction-status/schema/TransactionStatusRejectSchema";

export namespace transactionStatusRejectFx {
	export type Props = TransactionStatusRejectSchema.Type;
}

export const transactionStatusRejectFx = ({ messageThreadId }: transactionStatusRejectFx.Props) => {
	return Effect.gen(function* () {
		const transaction = yield* transactionResolveFx({
			messageThreadId,
			message: "You are not allowed to reject this listing transaction",
		});

		yield* transactionPatchFx({
			messageThreadId: transaction.messageThreadId,
		});

		return yield* transactionStatusCreateFx({
			messageThreadId: transaction.messageThreadId,
			status: "rejected",
			side: transaction.side,
		});
	});
};

export type transactionStatusRejectFx = ReturnType<typeof transactionStatusRejectFx>;
