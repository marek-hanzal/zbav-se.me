import { Effect } from "effect";
import { transactionPatchFx } from "~/@buyer/transaction/fx/transactionPatchFx";
import { transactionStatusCreateFx } from "~/@buyer/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusCloseSchema } from "~/@buyer/transaction-status/schema/TransactionStatusCloseSchema";
import { inboxCreateFx } from "~/@user/inbox/fx/inboxCreateFx";
import { messageSystemCreateFx } from "~/@user/message-system/fx/messageSystemCreateFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { traceLogFx } from "~/effect/traceLogFx";
import { InvalidRequestErrorFx } from "~/error/InvalidRequestErrorFx";

export namespace transactionStatusCloseFx {
	export interface Props extends TransactionStatusCloseSchema.Type {
		userId: string;
	}
}

export const transactionStatusCloseFx = Effect.fn("transactionStatusCloseFx")(function* ({
	userId,
	transactionId,
}: transactionStatusCloseFx.Props) {
	yield* traceLogFx({
		level: "trace",
		message: "transactionStatusCloseFx",
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

			if (transaction.side === "seller") {
				yield* traceLogFx({
					level: "trace",
					message: "transactionStatusCloseFx",
					error: {
						message: "Seller cannot close a transaction",
					},
				});
				return yield* new InvalidRequestErrorFx({
					message: "Seller cannot close a transaction",
				});
			}
			if (transaction.status !== "resolved" && transaction.status !== "dispute") {
				yield* traceLogFx({
					level: "trace",
					message: "transactionStatusCloseFx",
					error: {
						message: `Transaction must be resolved or dispute before close, got ${transaction.status}`,
					},
				});
				return yield* new InvalidRequestErrorFx({
					message: "Transaction must be resolved or dispute before close",
				});
			}

			yield* transactionPatchFx({
				userId,
				patch: {},
				query: {
					where: {
						id: transaction.id,
					},
				},
				scope: {
					userId,
				},
			});

			yield* messageSystemCreateFx({
				userId,
				messageThreadId: transaction.messageThreadId,
				text: "Transaction closed (message)",
			});

			yield* inboxCreateFx(
				transaction.side === "buyer"
					? {
							userId: transaction.sellerId,
							family: "message",
							type: "buyer-message",
							payload: {
								type: "buyer-message",
								transactionId: transaction.id,
								listingId: transaction.listingId,
								messageThreadId: transaction.messageThreadId,
							},
							priority: "high",
						}
					: {
							userId: transaction.buyerId,
							family: "message",
							type: "seller-message",
							payload: {
								type: "seller-message",
								transactionId: transaction.id,
								listingId: transaction.listingId,
								messageThreadId: transaction.messageThreadId,
							},
							priority: "high",
						},
			);

			yield* userInteractionEventFx({
				userId,
				targetId: transaction.sellerId,
				source: "transaction",
				group: transaction.id,
				event: "transaction.closed",
				isTerminal: true,
			});

			return yield* transactionStatusCreateFx({
				userId,
				transactionId: transaction.id,
				listingId: transaction.listingId,
				status: "closed",
				side: transaction.side,
			});
		}),
	);
});

export type transactionStatusCloseFx = ReturnType<typeof transactionStatusCloseFx>;
