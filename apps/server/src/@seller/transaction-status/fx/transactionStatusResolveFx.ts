import { Effect } from "effect";
import { transactionPatchFx } from "~/@seller/transaction/fx/transactionPatchFx";
import { transactionStatusCreateFx } from "~/@seller/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusResolveSchema } from "~/@seller/transaction-status/schema/TransactionStatusResolveSchema";
import { inboxCreateFx } from "~/@user/inbox/fx/inboxCreateFx";
import { messageSystemCreateFx } from "~/@user/message-system/fx/messageSystemCreateFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { traceLogFx } from "~/effect/traceLogFx";
import { InvalidRequestErrorFx } from "~/error/InvalidRequestErrorFx";

export namespace transactionStatusResolveFx {
	export interface Props extends TransactionStatusResolveSchema.Type {
		userId: string;
	}
}

export const transactionStatusResolveFx = Effect.fn("transactionStatusResolveFx")(function* ({
	userId,
	transactionId,
}: transactionStatusResolveFx.Props) {
	yield* traceLogFx({
		level: "trace",
		message: "transactionStatusResolveFx",
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
				message: "You are not allowed to resolve this listing transaction",
			});

			if (transaction.side === "buyer") {
				yield* traceLogFx({
					level: "trace",
					message: "transactionStatusResolveFx",
					error: {
						message: "Buyer cannot resolve a transaction",
					},
				});
				return yield* new InvalidRequestErrorFx({
					message: "Buyer cannot resolve a transaction",
				});
			}
			if (transaction.status !== "open" && transaction.status !== "dispute") {
				yield* traceLogFx({
					level: "trace",
					message: "transactionStatusResolveFx",
					error: {
						message: `Transaction must be open or dispute before resolve, got ${transaction.status}`,
					},
				});
				return yield* new InvalidRequestErrorFx({
					message: "Transaction must be open or dispute before resolve",
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
				text: "Seller resolved the transaction (message)",
			});

			yield* inboxCreateFx({
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
			});

			yield* userInteractionEventFx({
				userId,
				targetId: transaction.buyerId,
				source: "transaction",
				group: transaction.id,
				event: "transaction.resolved",
				isTerminal: false,
			});

			return yield* transactionStatusCreateFx({
				userId,
				transactionId: transaction.id,
				listingId: transaction.listingId,
				status: "resolved",
				side: transaction.side,
			});
		}),
	);
});

export type transactionStatusResolveFx = ReturnType<typeof transactionStatusResolveFx>;
