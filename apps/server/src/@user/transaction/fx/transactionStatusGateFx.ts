import { Effect } from "effect";
import type { TransactionStatusEnumSchema } from "~/app/transaction/schema/ListingTransactionStatusEnumSchema";
import { InvalidRequestError } from "~/error/InvalidRequestError";
import { transactionResolveFx } from "./transactionResolveFx";

export namespace transactionStatusGateFx {
	export interface Props {
		transactionId: string;
		allowedStatuses: TransactionStatusEnumSchema.Type[];
		message?: string;
	}
}

export const transactionStatusGateFx = ({
	transactionId,
	allowedStatuses,
	message,
}: transactionStatusGateFx.Props) => {
	return Effect.gen(function* () {
		const transaction = yield* transactionResolveFx({
			transactionId,
		});

		if (!transaction.status || !allowedStatuses.includes(transaction.status)) {
			return yield* new InvalidRequestError({
				message:
					message ??
					`Transaction must be in one of the following statuses: ${allowedStatuses.join(", ")}`,
			});
		}

		return transaction;
	});
};

export type transactionStatusGateFx = ReturnType<typeof transactionStatusGateFx>;
