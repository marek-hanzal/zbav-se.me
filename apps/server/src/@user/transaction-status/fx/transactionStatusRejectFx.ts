import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import type { DateTime } from "luxon";
import { transactionStatusCreateFx } from "~/@user/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusRejectSchema } from "~/@user/transaction-status/schema/TransactionStatusRejectSchema";
import { messageSystemCreateFx } from "~/app/message-system/fx/messageSystemCreateFx";
import { transactionPatchFx } from "~/app/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/app/transaction/fx/transactionResolveFx";
import { userInteractionEventFx } from "~/app/user-event/fx/userInteractionEventFx";
import type { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace transactionStatusRejectFx {
	export interface Props extends TransactionStatusRejectSchema.Type {
		userId: string;
		createdAt?: DateTime;
	}
}

export const transactionStatusRejectFx = Effect.fn("transactionStatusRejectFx")(function* ({
	userId,
	transactionId,
	createdAt,
}: transactionStatusRejectFx.Props) {
	const transaction = yield* transactionResolveFx({
		userId,
		transactionId,
		message: "You are not allowed to reject this listing transaction",
	});

	yield* transactionPatchFx({
		userId,
		patch: {},
		query: {
			where: {
				id: transaction.id,
			},
		},
		updatedAt: createdAt,
		scope: {
			userId,
		},
	});

	yield* messageSystemCreateFx({
		userId,
		messageThreadId: transaction.messageThreadId,
		message:
			transaction.side === "buyer"
				? "Buyer rejected the transaction (message)"
				: "Seller rejected the transaction (message)",
		createdAt,
	});

	yield* userInteractionEventFx({
		userId,
		targetId: transaction.buyerId,
		source: "transaction",
		group: transaction.id,
		event: "transaction.rejected",
		isTerminal: true,
	});

	return yield* transactionStatusCreateFx({
		userId,
		transactionId: transaction.id,
		listingId: transaction.listingId,
		status: "rejected",
		side: transaction.side,
		createdAt,
	});
});

export type transactionStatusRejectFx = ReturnType<typeof transactionStatusRejectFx>;

type _NoUser = AssertNever<
	Extract<Effect.Effect.Context<transactionStatusRejectFx>, UserContextFx>
>;
