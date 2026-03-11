import { translator } from "@use-pico/common/translator";
import type { tTransactionEntry } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";

export namespace PreviewValue {
	export interface Props {
		transactionEntry: tTransactionEntry;
	}
}

export const PreviewValue: FC<PreviewValue.Props> = ({ transactionEntry }) => {
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
			() => translator.text("Transaction row - status pending (label)"),
		)
		.with(
			{
				kind: "status-open",
			},
			() => translator.text("Transaction row - status open (label)"),
		)
		.with(
			{
				kind: "status-resolved",
			},
			() => translator.text("Transaction row - status resolved (label)"),
		)
		.with(
			{
				kind: "status-dispute-buyer",
			},
			{
				kind: "status-dispute-seller",
			},
			() => translator.text("Transaction row - status dispute (label)"),
		)
		.with(
			{
				kind: "status-rejected-buyer",
			},
			{
				kind: "status-rejected-seller",
			},
			() => translator.text("Transaction row - status rejected (label)"),
		)
		.with(
			{
				kind: "status-sold",
			},
			() => translator.text("Transaction row - status sold (label)"),
		)
		.with(
			{
				kind: "status-expired",
			},
			() => translator.text("Transaction row - status expired (label)"),
		)
		.with(
			{
				kind: "status-success",
			},
			() => translator.text("Transaction row - status success (label)"),
		)
		.with(
			{
				kind: "status-closed",
			},
			() => translator.text("Transaction row - status closed (label)"),
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
