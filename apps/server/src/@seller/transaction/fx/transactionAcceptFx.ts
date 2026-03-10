import { Effect } from "effect";
import { transactionFetchFx } from "~/@seller/transaction/fx/transactionFetchFx";
import { inboxCreateFx } from "~/@user/inbox/fx/inboxCreateFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionUpdateStatusFx } from "~/@user/transaction/fx/transactionUpdateStatusFx";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { traceLogFx } from "~/effect/traceLogFx";

export namespace transactionAcceptFx {
	export interface Props {
		transactionId: string;
		userId: string;
	}
}

export const transactionAcceptFx = Effect.fn("transactionAcceptFx")(function* ({
	userId,
	transactionId,
}: transactionAcceptFx.Props) {
	yield* traceLogFx({
		level: "trace",
		message: "transactionAcceptFx",
		input: {
			userId,
			transactionId,
		},
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const transaction = yield* transactionResolveFx({
				userId,
				transactionId,
				message: "You are not allowed to accept this listing transaction",
			});

			yield* transactionUpdateStatusFx({
				userId,
				transactionId: transaction.id,
				status: transaction.status,
				request: "open",
				target: "seller",
				side: transaction.side,
			});

			yield* inboxCreateFx({
				userId: transaction.buyerId,
				family: "message",
				type: "seller-message",
				payload: {
					type: "seller-message",
					transactionId: transaction.id,
				},
				priority: "high",
			});

			yield* userInteractionEventFx({
				userId,
				targetId: transaction.buyerId,
				source: "transaction",
				group: transaction.id,
				event: "transaction.open",
				isTerminal: false,
			});

			return yield* transactionFetchFx({
				where: {
					id: transaction.id,
				},
				scope: {
					userId,
				},
			});
		}),
	);
});

export type transactionAcceptFx = ReturnType<typeof transactionAcceptFx>;
