import { Effect } from "effect";
import type { DateTime } from "luxon";
import { messageSystemCreateFx } from "~/@user/message-system/fx/messageSystemCreateFx";
import { transactionPatchFx } from "~/@user/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionStatusCreateFx } from "~/@user/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusCloseSchema } from "~/@user/transaction-status/schema/TransactionStatusCloseSchema";
import { InvalidRequestError } from "~/error/InvalidRequestError";

export namespace transactionStatusCloseFx {
	export type Props = TransactionStatusCloseSchema.Type & {
		createdAt?: DateTime;
	};
}

export const transactionStatusCloseFx = ({
	transactionId,
	createdAt,
}: transactionStatusCloseFx.Props) => {
	return Effect.gen(function* () {
		const transaction = yield* transactionResolveFx({
			transactionId,
			message: "You are not allowed to close this listing transaction",
		});

		if (transaction.side === "seller") {
			return yield* new InvalidRequestError({
				message: "Seller cannot close a transaction",
			});
		}

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
			message: "Transaction closed (message)",
			createdAt,
		});

		return yield* transactionStatusCreateFx({
			transactionId: transaction.id,
			listingId: transaction.listingId,
			status: "closed",
			side: transaction.side,
			createdAt,
		});
	});
};

export type transactionStatusCloseFx = ReturnType<typeof transactionStatusCloseFx>;
