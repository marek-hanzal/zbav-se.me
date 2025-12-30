import { Effect } from "effect";
import type { DateTime } from "luxon";
import { messageSystemCreateFx } from "~/@user/message-system/fx/messageSystemCreateFx";
import { transactionPatchFx } from "~/@user/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionStatusCreateFx } from "~/@user/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusRejectSchema } from "~/@user/transaction-status/schema/TransactionStatusRejectSchema";

export namespace transactionStatusRejectFx {
	export interface Props extends TransactionStatusRejectSchema.Type {
		createdAt?: DateTime;
	}
}

export const transactionStatusRejectFx = ({
	transactionId,
	createdAt,
}: transactionStatusRejectFx.Props) => {
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

		return yield* transactionStatusCreateFx({
			transactionId: transaction.id,
			status: "rejected",
			side: transaction.side,
			createdAt,
		});
	});
};

export type transactionStatusRejectFx = ReturnType<typeof transactionStatusRejectFx>;
