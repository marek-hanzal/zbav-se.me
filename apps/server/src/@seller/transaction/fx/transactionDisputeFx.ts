import { Effect } from "effect";
import { inboxCreateFx } from "~/@user/inbox/fx/inboxCreateFx";
import { transactionFetchFx } from "~/@seller/transaction/fx/transactionFetchFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionUpdateStatusFx } from "~/@user/transaction/fx/transactionUpdateStatusFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { traceLogFx } from "~/effect/traceLogFx";

export namespace transactionDisputeFx {
	export interface Props {
		transactionId: string;
		userId: string;
	}
}

export const transactionDisputeFx = Effect.fn("transactionDisputeFx")(function* ({
	userId,
	transactionId,
}: transactionDisputeFx.Props) {
	yield* traceLogFx({
		level: "trace",
		message: "transactionDisputeFx",
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
				message: "You are not allowed to dispute this listing transaction",
			});

			yield* transactionUpdateStatusFx({
				userId,
				transactionId: transaction.id,
				status: transaction.status,
				request: "dispute",
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

export type transactionDisputeFx = ReturnType<typeof transactionDisputeFx>;
