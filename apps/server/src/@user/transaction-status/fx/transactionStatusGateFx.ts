import { Effect } from "effect";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import type { TransactionStatusEnumSchema } from "~/database/@enum/TransactionStatusEnumSchema";
import { withTraceFx } from "~/effect/withTraceFx";
import { InvalidRequestErrorFx } from "~/error/InvalidRequestErrorFx";

export namespace transactionStatusGateFx {
	export interface Props {
		userId: string;
		transactionId: string;
		allowedStatuses: TransactionStatusEnumSchema.Type[];
		message?: string;
	}
}

export const transactionStatusGateFx = Effect.fn("transactionStatusGateFx")(function* ({
	userId,
	transactionId,
	allowedStatuses,
	message,
}: transactionStatusGateFx.Props) {
	yield* withTraceFx({
		fx: "transactionStatusGateFx",
		input: {
			userId,
			transactionId,
			allowedStatuses,
			message,
		},
	});

	const transaction = yield* transactionResolveFx({
		userId,
		transactionId,
	});

	if (!transaction.status || !allowedStatuses.includes(transaction.status)) {
		const errorMessage =
			message ??
			`Transaction must be in one of the following statuses: ${allowedStatuses.join(", ")}`;
		yield* withTraceFx({
			fx: "transactionStatusGateFx",
			error: {
				message: errorMessage,
			},
		});
		return yield* new InvalidRequestErrorFx({
			message: errorMessage,
		});
	}

	return transaction;
});

export type transactionStatusGateFx = ReturnType<typeof transactionStatusGateFx>;
