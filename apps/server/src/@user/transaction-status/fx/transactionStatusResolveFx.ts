import { Effect } from "effect";
import type { DateTime } from "luxon";
import { messageSystemCreateFx } from "~/@user/message-system/fx/messageSystemCreateFx";
import { transactionPatchFx } from "~/@user/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionStatusCreateFx } from "~/@user/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusResolveSchema } from "~/@user/transaction-status/schema/TransactionStatusResolveSchema";
import { InvalidRequestError } from "~/error/InvalidRequestError";

export namespace transactionStatusResolveFx {
	export type Props = TransactionStatusResolveSchema.Type & {
		createdAt: DateTime;
	};
}

export const transactionStatusResolveFx = ({
	transactionId,
	createdAt,
}: transactionStatusResolveFx.Props) => {
	return Effect.gen(function* () {
		const transaction = yield* transactionResolveFx({
			transactionId,
			message: "You are not allowed to resolve this listing transaction",
		});

		if (transaction.side === "buyer") {
			return yield* new InvalidRequestError({
				message: "Buyer cannot resolve a transaction",
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
			message: "Seller resolved the transaction (message)",
			createdAt,
		});

		return yield* transactionStatusCreateFx({
			transactionId: transaction.id,
			status: "resolved",
			side: transaction.side,
			createdAt,
		});
	});
};

export type transactionStatusResolveFx = ReturnType<typeof transactionStatusResolveFx>;
