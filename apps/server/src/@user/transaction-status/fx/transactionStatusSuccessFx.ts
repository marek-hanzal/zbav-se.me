import { Effect } from "effect";
import { messageSystemCreateFx } from "~/@user/message-system/fx/messageSystemCreateFx";
import { transactionPatchFx } from "~/@user/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionStatusCreateFx } from "~/@user/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusSuccessSchema } from "~/@user/transaction-status/schema/TransactionStatusSuccessSchema";
import { InvalidRequestError } from "~/error/InvalidRequestError";

export namespace transactionStatusSuccessFx {
	export type Props = TransactionStatusSuccessSchema.Type;
}

export const transactionStatusSuccessFx = ({ transactionId }: transactionStatusSuccessFx.Props) => {
	return Effect.gen(function* () {
		const transaction = yield* transactionResolveFx({
			transactionId,
			message: "You are not allowed to mark this listing transaction as successful",
		});

		if (transaction.side === "seller") {
			return yield* new InvalidRequestError({
				message: "Seller cannot mark a transaction as successful",
			});
		}

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
			message: "Buyer marked the transaction as successful (message)",
		});

		return yield* transactionStatusCreateFx({
			transactionId: transaction.id,
			status: "success",
			side: transaction.side,
		});
	});
};

export type transactionStatusSuccessFx = ReturnType<typeof transactionStatusSuccessFx>;
