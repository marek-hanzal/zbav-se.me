import { Effect } from "effect";
import type { DateTime } from "luxon";
import { messageSystemCreateFx } from "~/@user/message-system/fx/messageSystemCreateFx";
import { transactionPatchFx } from "~/@user/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionStatusCreateFx } from "~/@user/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusDisputeSchema } from "~/@user/transaction-status/schema/TransactionStatusDisputeSchema";

export namespace transactionStatusDisputeFx {
	export type Props = TransactionStatusDisputeSchema.Type & {
		createdAt: DateTime;
	};
}

export const transactionStatusDisputeFx = ({
	transactionId,
	createdAt,
}: transactionStatusDisputeFx.Props) => {
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
			updatedAt: createdAt,
		});

		yield* messageSystemCreateFx({
			messageThreadId: transaction.messageThreadId,
			message: "Transaction dispute (message)",
			createdAt,
		});

		return yield* transactionStatusCreateFx({
			transactionId: transaction.id,
			status: "dispute",
			side: transaction.side,
			createdAt,
		});
	});
};

export type transactionStatusDisputeFx = ReturnType<typeof transactionStatusDisputeFx>;
