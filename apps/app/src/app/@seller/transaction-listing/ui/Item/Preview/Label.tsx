import { Typo } from "@use-pico/client/ui/typo";
import { translator } from "@use-pico/common/translator";
import type { tTransactionEntry } from "@zbav-se.me/sdk/api/user";
import { withTransactionEntryQuery } from "@zbav-se.me/sdk/query/user/transaction-entry";
import type { FC } from "react";
import { match } from "ts-pattern";
import { toStatusLabel } from "../toStatusLabel";

export namespace Label {
	export interface Props {
		transactionEntryId: string;
	}
}

const toLabel = (transactionEntry: tTransactionEntry) => {
	return match(transactionEntry)
		.with(
			{
				kind: "text",
			},
			(transactionEntry) => {
				return transactionEntry.payload.text;
			},
		)
		.with(
			{
				kind: "status-pending",
			},
			() => toStatusLabel("pending"),
		)
		.with(
			{
				kind: "status-open",
			},
			() => toStatusLabel("open"),
		)
		.with(
			{
				kind: "status-resolved",
			},
			() => toStatusLabel("resolved"),
		)
		.with(
			{
				kind: "status-dispute-buyer",
			},
			{
				kind: "status-dispute-seller",
			},
			() => toStatusLabel("dispute"),
		)
		.with(
			{
				kind: "status-rejected-buyer",
			},
			{
				kind: "status-rejected-seller",
			},
			() => toStatusLabel("rejected"),
		)
		.with(
			{
				kind: "status-sold",
			},
			() => toStatusLabel("sold"),
		)
		.with(
			{
				kind: "status-expired",
			},
			() => toStatusLabel("expired"),
		)
		.with(
			{
				kind: "status-success",
			},
			() => toStatusLabel("success"),
		)
		.with(
			{
				kind: "status-closed",
			},
			() => toStatusLabel("closed"),
		)
		.with(
			{
				kind: "gallery",
			},
			() => translator.text("Transaction row - gallery activity (label)"),
		)
		.with(
			{
				kind: "location",
			},
			() => translator.text("Transaction row - location activity (label)"),
		)
		.with(
			{
				kind: "package",
			},
			() => translator.text("Transaction row - package activity (label)"),
		)
		.with(
			{
				kind: "personal",
			},
			() => translator.text("Transaction row - personal activity (label)"),
		)
		.exhaustive();
};

export const Label: FC<Label.Props> = ({ transactionEntryId }) => {
	const { data: transactionEntry } = withTransactionEntryQuery.useFetchQuery(transactionEntryId);

	return (
		<Typo
			data-ui="TransactionItemPreview[Value]"
			label={toLabel(transactionEntry)}
			ui={{
				text: "sm",
				opacity: "6",
			}}
			className={[
				"block",
				"w-full",
				"max-w-full",
				"min-w-0",
				"truncate",
			]}
		/>
	);
};
