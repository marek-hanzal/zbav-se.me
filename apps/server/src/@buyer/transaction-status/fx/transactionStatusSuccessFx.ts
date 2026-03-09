import { Effect } from "effect";
import { transactionStatusCreateFx } from "~/@buyer/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusSuccessSchema } from "~/@buyer/transaction-status/schema/TransactionStatusSuccessSchema";
import { inboxCreateFx } from "~/@user/inbox/fx/inboxCreateFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { traceLogFx } from "~/effect/traceLogFx";
import { InvalidRequestErrorFx } from "~/error/InvalidRequestErrorFx";

export namespace transactionStatusSuccessFx {
	export interface Props extends TransactionStatusSuccessSchema.Type {
		userId: string;
	}
}

export const transactionStatusSuccessFx = Effect.fn("transactionStatusSuccessFx")(function* ({
	userId,
	transactionId,
}: transactionStatusSuccessFx.Props) {
	yield* traceLogFx({
		level: "trace",
		message: "transactionStatusSuccessFx",
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
				message: "You are not allowed to mark this listing transaction as successful",
			});

			if (transaction.side === "seller") {
				yield* traceLogFx({
					level: "trace",
					message: "transactionStatusSuccessFx",
					error: {
						message: "Seller cannot mark a transaction as successful",
					},
				});
				return yield* new InvalidRequestErrorFx({
					message: "Seller cannot mark a transaction as successful",
				});
			}
			if (transaction.status !== "resolved" && transaction.status !== "dispute") {
				yield* traceLogFx({
					level: "trace",
					message: "transactionStatusSuccessFx",
					error: {
						message: `Transaction must be resolved or dispute before success, got ${transaction.status}`,
					},
				});
				return yield* new InvalidRequestErrorFx({
					message: "Transaction must be resolved or dispute before success",
				});
			}

			yield* inboxCreateFx(
				transaction.side === "buyer"
					? {
							userId: transaction.sellerId,
							family: "message",
							type: "buyer-message",
							payload: {
								type: "buyer-message",
								transactionId: transaction.id,
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
							},
							priority: "high",
						},
			);

			yield* userInteractionEventFx({
				userId,
				targetId: transaction.sellerId,
				source: "transaction",
				group: transaction.id,
				event: "transaction.success",
				isTerminal: true,
			});

			return yield* transactionStatusCreateFx({
				userId,
				transactionId: transaction.id,
				listingId: transaction.listingId,
				status: "success",
				side: transaction.side,
			});
		}),
	);
});

export type transactionStatusSuccessFx = ReturnType<typeof transactionStatusSuccessFx>;
