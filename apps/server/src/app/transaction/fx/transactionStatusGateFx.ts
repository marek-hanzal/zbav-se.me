import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { transactionResolveFx } from "~/app/transaction/fx/transactionResolveFx";
import type { TransactionStatusEnumSchema } from "~/app/transaction/schema/TransactionStatusEnumSchema";
import type { UserContextFx } from "~/auth/fx/UserContextFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";

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
	const transaction = yield* transactionResolveFx({
		userId,
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

export type transactionStatusGateFx = ReturnType<typeof transactionStatusGateFx>;

type _NoUser = AssertNever<Extract<Effect.Effect.Context<transactionStatusGateFx>, UserContextFx>>;
