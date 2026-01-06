import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import type { DateTime } from "luxon";
import { transactionPatchFx } from "~/@user/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionStatusCreateFx } from "~/@user/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusDisputeSchema } from "~/@user/transaction-status/schema/TransactionStatusDisputeSchema";
import { messageSystemCreateFx } from "~/app/message-system/fx/messageSystemCreateFx";
import type { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace transactionStatusDisputeFx {
	export interface Props extends TransactionStatusDisputeSchema.Type {
		userId: string;
		createdAt?: DateTime;
	}
}

export const transactionStatusDisputeFx = ({
	userId,
	transactionId,
	createdAt,
}: transactionStatusDisputeFx.Props) => {
	return Effect.gen(function* () {
		const transaction = yield* transactionResolveFx({
			userId,
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
			userId,
			messageThreadId: transaction.messageThreadId,
			message: "Transaction dispute (message)",
			createdAt,
		});

		return yield* transactionStatusCreateFx({
			transactionId: transaction.id,
			listingId: transaction.listingId,
			status: "dispute",
			side: transaction.side,
			createdAt,
		});
	});
};

export type transactionStatusDisputeFx = ReturnType<typeof transactionStatusDisputeFx>;

type _NoUser = AssertNever<
	Extract<Effect.Effect.Context<transactionStatusDisputeFx>, UserContextFx>
>;
