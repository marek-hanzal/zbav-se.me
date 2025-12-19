import { Effect } from "effect";
import { messageTextCreateFx } from "~/@user/message-text/fx/messageCreateFx";
import { transactionPatchFx } from "~/@user/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionStatusCreateFx } from "~/@user/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusAcceptSchema } from "~/@user/transaction-status/schema/TransactionStatusAcceptSchema";
import { RuntimeError } from "~/error/RuntimeError";

export namespace transactionStatusAcceptFx {
	export type Props = TransactionStatusAcceptSchema.Type;
}

export const transactionStatusAcceptFx = ({ transactionId }: transactionStatusAcceptFx.Props) => {
	return Effect.gen(function* () {
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
		});

		yield* messageTextCreateFx({
			messageThreadId: transaction.messageThreadId,
			message: "Seller accepted the transaction (message)",
		});

		return yield* transactionStatusCreateFx({
			transactionId: transaction.id,
			status: "accepted",
			side: transaction.side,
		});
	});
};

export type transactionStatusAcceptFx = ReturnType<typeof transactionStatusAcceptFx>;
