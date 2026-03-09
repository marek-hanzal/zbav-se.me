import { Effect } from "effect";
import { match } from "ts-pattern";
import { createTransactionEntryFx } from "~/@user/transaction-entry/fx/createTransactionEntryFx";
import type { TransactionSideEnumSchema } from "~/database/@enum/TransactionSideEnumSchema";
import type { TransactionStatusEnumSchema } from "~/database/@enum/TransactionStatusEnumSchema";

export namespace withTransactionStatusEntryFx {
	export interface Props {
		transactionId: string;
		userId: string | null;
		scopeUserId: string;
		status: TransactionStatusEnumSchema.Type;
		side: TransactionSideEnumSchema.Type;
	}
}

export const withTransactionStatusEntryFx = Effect.fn("withTransactionStatusEntryFx")(function* ({
	transactionId,
	userId,
	scopeUserId,
	status,
	side,
}: withTransactionStatusEntryFx.Props) {
	return yield* match({
		status,
		side,
	})
		.with(
			{
				status: "pending",
			},
			() =>
				createTransactionEntryFx({
					transactionId,
					kind: "status-pending",
					userId,
					payload: {
						text: "Transaction pending (message)",
					},
					scopeUserId,
				}),
		)
		.with(
			{
				status: "open",
			},
			() =>
				createTransactionEntryFx({
					transactionId,
					kind: "status-open",
					userId,
					payload: {
						text: "Seller accepted the transaction (message)",
					},
					scopeUserId,
				}),
		)
		.with(
			{
				status: "resolved",
			},
			() =>
				createTransactionEntryFx({
					transactionId,
					kind: "status-resolved",
					userId,
					payload: {
						text: "Seller resolved the transaction (message)",
					},
					scopeUserId,
				}),
		)
		.with(
			{
				status: "dispute",
				side: "buyer",
			},
			() =>
				createTransactionEntryFx({
					transactionId,
					kind: "status-dispute-buyer",
					userId,
					payload: {
						text: "Buyer disputed the transaction (message)",
					},
					scopeUserId,
				}),
		)
		.with(
			{
				status: "dispute",
				side: "seller",
			},
			() =>
				createTransactionEntryFx({
					transactionId,
					kind: "status-dispute-seller",
					userId,
					payload: {
						text: "Seller disputed the transaction (message)",
					},
					scopeUserId,
				}),
		)
		.with(
			{
				status: "rejected",
				side: "buyer",
			},
			() =>
				createTransactionEntryFx({
					transactionId,
					kind: "status-rejected-buyer",
					userId,
					payload: {
						text: "Buyer rejected the transaction (message)",
					},
					scopeUserId,
				}),
		)
		.with(
			{
				status: "rejected",
				side: "seller",
			},
			() =>
				createTransactionEntryFx({
					transactionId,
					kind: "status-rejected-seller",
					userId,
					payload: {
						text: "Seller rejected the transaction (message)",
					},
					scopeUserId,
				}),
		)
		.with(
			{
				status: "expired",
			},
			() =>
				createTransactionEntryFx({
					transactionId,
					kind: "status-expired",
					userId,
					payload: {
						text: "Transaction expired (message)",
					},
					scopeUserId,
				}),
		)
		.with(
			{
				status: "success",
			},
			() =>
				createTransactionEntryFx({
					transactionId,
					kind: "status-success",
					userId,
					payload: {
						text: "Transaction successful (message)",
					},
					scopeUserId,
				}),
		)
		.with(
			{
				status: "closed",
			},
			() =>
				createTransactionEntryFx({
					transactionId,
					kind: "status-closed",
					userId,
					payload: {
						text: "Transaction closed (message)",
					},
					scopeUserId,
				}),
		)
		.otherwise(() =>
			createTransactionEntryFx({
				transactionId,
				kind: "status-sold",
				userId,
				payload: {
					text: "Transaction sold (message)",
				},
				scopeUserId,
			}),
		);
});
