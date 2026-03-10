import type { MarkSuspense } from "@use-pico/client/type";
import type { tUserSideEnum } from "@zbav-se.me/sdk/api/public";
import { withTransactionEntryQuery } from "@zbav-se.me/sdk/query/user/transaction-entry";
import type { FC } from "react";
import { match } from "ts-pattern";
import { TransactionEntryGallery } from "../type/TransactionEntryGallery";
import { TransactionEntryLocation } from "../type/TransactionEntryLocation";
import { TransactionEntryPackage } from "../type/TransactionEntryPackage";
import { TransactionEntryPersonal } from "../type/TransactionEntryPersonal";
import { TransactionEntryText } from "../type/TransactionEntryText";

export namespace Data {
	export interface Props extends MarkSuspense.Props {
		side: tUserSideEnum;
		messageId: string;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, side, messageId }) => {
	const { data: message } = withTransactionEntryQuery.useFetchQuery(messageId);

	return match(message)
		.with(
			{
				kind: "text",
			},
			(message) => (
				<TransactionEntryText
					side={side}
					transactionEntry={message}
				/>
			),
		)
		.with(
			{
				kind: "status-pending",
			},
			{
				kind: "status-open",
			},
			{
				kind: "status-resolved",
			},
			{
				kind: "status-dispute-buyer",
			},
			{
				kind: "status-dispute-seller",
			},
			{
				kind: "status-rejected-buyer",
			},
			{
				kind: "status-rejected-seller",
			},
			{
				kind: "status-sold",
			},
			{
				kind: "status-expired",
			},
			{
				kind: "status-success",
			},
			{
				kind: "status-closed",
			},
			(message) => (
				<TransactionEntryText
					side={side}
					transactionEntry={message}
				/>
			),
		)
		.with(
			{
				kind: "gallery",
			},
			(message) => <TransactionEntryGallery transactionEntry={message} />,
		)
		.with(
			{
				kind: "location",
			},
			(message) => <TransactionEntryLocation transactionEntry={message} />,
		)
		.with(
			{
				kind: "personal",
			},
			(message) => <TransactionEntryPersonal transactionEntry={message} />,
		)
		.with(
			{
				kind: "package",
			},
			(message) => <TransactionEntryPackage transactionEntry={message} />,
		)
		.exhaustive();
};
