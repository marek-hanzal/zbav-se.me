import { Effect } from "effect";
import { transactionFetchFx } from "~/@buyer/transaction/fx/transactionFetchFx";
import { inboxCreateFx } from "~/@user/inbox/fx/inboxCreateFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionUpdateStatusFx } from "~/@user/transaction/fx/transactionUpdateStatusFx";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { traceLogFx } from "~/effect/traceLogFx";

export namespace transactionRejectFx {
	export interface Props {
		transactionId: string;
		userId: string;
	}
}

export const transactionRejectFx = Effect.fn("transactionRejectFx")(function* ({
	userId,
	transactionId,
}: transactionRejectFx.Props) {
	yield* traceLogFx({
		level: "trace",
		message: "transactionRejectFx",
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
				message: "You are not allowed to reject this listing transaction",
			});

			yield* transactionUpdateStatusFx({
				userId,
				transactionId: transaction.id,
				status: transaction.status,
				request: "rejected",
				target: "buyer",
				side: transaction.side,
			});

			yield* inboxCreateFx({
				userId: transaction.sellerId,
				family: "message",
				type: "buyer-message",
				payload: {
					type: "buyer-message",
					transactionId: transaction.id,
				},
				priority: "high",
			});

			yield* userInteractionEventFx({
				userId,
				targetId: transaction.sellerId,
				source: "transaction",
				group: transaction.id,
				event: "transaction.rejected",
				isTerminal: true,
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

export type transactionRejectFx = ReturnType<typeof transactionRejectFx>;
