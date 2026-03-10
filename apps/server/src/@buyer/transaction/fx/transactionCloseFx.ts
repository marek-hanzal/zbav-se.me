import { Effect } from "effect";
import { transactionFetchFx } from "~/@buyer/transaction/fx/transactionFetchFx";
import { inboxCreateFx } from "~/@user/inbox/fx/inboxCreateFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionUpdateStatusFx } from "~/@user/transaction/fx/transactionUpdateStatusFx";
import { transactionEntryCreateFx } from "~/@user/transaction-entry/fx/transactionEntryCreateFx";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { traceLogFx } from "~/effect/traceLogFx";

export namespace transactionCloseFx {
	export interface Props {
		transactionId: string;
		userId: string;
	}
}

export const transactionCloseFx = Effect.fn("transactionCloseFx")(function* ({
	userId,
	transactionId,
}: transactionCloseFx.Props) {
	yield* traceLogFx({
		level: "trace",
		message: "transactionCloseFx",
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
				message: "You are not allowed to close this listing transaction",
			});

			yield* transactionUpdateStatusFx({
				userId,
				transactionId: transaction.id,
				status: transaction.status,
				request: "closed",
				target: transaction.side,
				side: transaction.side,
			});

			/**
			 * @TODO Create transactionStatusMessageFx which will generate proper messages for buyer/seller based on the status
			 */
			yield* transactionEntryCreateFx({
				kind: "status-closed",
				transactionId: transaction.id,
				userId,
				// payload: {
				//     text: transaction.side === 'buyer'
				// },
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
				event: "transaction.closed",
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

export type transactionCloseFx = ReturnType<typeof transactionCloseFx>;
