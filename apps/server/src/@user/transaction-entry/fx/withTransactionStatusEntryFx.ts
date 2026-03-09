import { Effect } from "effect";
import { match } from "ts-pattern";
import { transactionEntryAppendFx } from "~/@user/transaction-entry/fx/transactionEntryAppendFx";
import type { TransactionEntryKindEnumSchema } from "~/database/@enum/TransactionEntryKindEnumSchema";
import type { TransactionSideEnumSchema } from "~/database/@enum/TransactionSideEnumSchema";
import type { TransactionStatusEnumSchema } from "~/database/@enum/TransactionStatusEnumSchema";

export namespace withTransactionStatusEntryFx {
	export interface Entry {
		kind: TransactionEntryKindEnumSchema.Type;
		text: string;
	}

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
	const entry = match({
		status,
		side,
	})
		.with(
			{
				status: "pending",
			},
			(): withTransactionStatusEntryFx.Entry => ({
				kind: "status-pending",
				text: "Transaction pending (message)",
			}),
		)
		.with(
			{
				status: "open",
			},
			(): withTransactionStatusEntryFx.Entry => ({
				kind: "status-open",
				text: "Seller accepted the transaction (message)",
			}),
		)
		.with(
			{
				status: "resolved",
			},
			(): withTransactionStatusEntryFx.Entry => ({
				kind: "status-resolved",
				text: "Seller resolved the transaction (message)",
			}),
		)
		.with(
			{
				status: "dispute",
				side: "buyer",
			},
			(): withTransactionStatusEntryFx.Entry => ({
				kind: "status-dispute-buyer",
				text: "Buyer disputed the transaction (message)",
			}),
		)
		.with(
			{
				status: "dispute",
				side: "seller",
			},
			(): withTransactionStatusEntryFx.Entry => ({
				kind: "status-dispute-seller",
				text: "Seller disputed the transaction (message)",
			}),
		)
		.with(
			{
				status: "rejected",
				side: "buyer",
			},
			(): withTransactionStatusEntryFx.Entry => ({
				kind: "status-rejected-buyer",
				text: "Buyer rejected the transaction (message)",
			}),
		)
		.with(
			{
				status: "rejected",
				side: "seller",
			},
			(): withTransactionStatusEntryFx.Entry => ({
				kind: "status-rejected-seller",
				text: "Seller rejected the transaction (message)",
			}),
		)
		.with(
			{
				status: "expired",
			},
			(): withTransactionStatusEntryFx.Entry => ({
				kind: "status-expired",
				text: "Transaction expired (message)",
			}),
		)
		.with(
			{
				status: "success",
			},
			(): withTransactionStatusEntryFx.Entry => ({
				kind: "status-success",
				text: "Transaction successful (message)",
			}),
		)
		.with(
			{
				status: "closed",
			},
			(): withTransactionStatusEntryFx.Entry => ({
				kind: "status-closed",
				text: "Transaction closed (message)",
			}),
		)
		.otherwise(
			(): withTransactionStatusEntryFx.Entry => ({
				kind: "status-sold",
				text: "Transaction sold (message)",
			}),
		);

	return yield* transactionEntryAppendFx({
		transactionId,
		kind: entry.kind,
		userId,
		payload: {
			text: entry.text,
		},
		scopeUserId,
	});
});
