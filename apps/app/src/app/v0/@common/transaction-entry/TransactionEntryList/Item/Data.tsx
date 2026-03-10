import type { MarkSuspense } from "@use-pico/client/type";
import type { tUserSideEnum } from "@zbav-se.me/sdk/api/public";
import { withTransactionEntryQuery } from "@zbav-se.me/sdk/query/user/transaction-entry";
import type { FC } from "react";
import { match } from "ts-pattern";
import { TransactionEntryCommon } from "../../type/TransactionEntryCommon";
import { TransactionEntryGallery } from "../../type/TransactionEntryGallery";
import { TransactionEntryLocation } from "../../type/TransactionEntryLocation";
import { TransactionEntryPackage } from "../../type/TransactionEntryPackage";
import { TransactionEntryPersonal } from "../../type/TransactionEntryPersonal";
import { TransactionEntryText } from "../../type/TransactionEntryText";

export namespace Data {
	export interface Props extends MarkSuspense.Props {
		side: tUserSideEnum;
		transactionEntryId: string;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, side, transactionEntryId }) => {
	const { data: transactionEntry } = withTransactionEntryQuery.useFetchQuery(transactionEntryId);

	return match(transactionEntry)
		.with(
			{
				kind: "text",
			},
			(transactionEntry) => (
				<TransactionEntryText
					side={side}
					transactionEntry={transactionEntry}
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
			(transactionEntry) => (
				<TransactionEntryCommon
					side={side}
					transactionEntry={transactionEntry}
				/>
			),
		)
		.with(
			{
				kind: "gallery",
			},
			(transactionEntry) => <TransactionEntryGallery transactionEntry={transactionEntry} />,
		)
		.with(
			{
				kind: "location",
			},
			(transactionEntry) => <TransactionEntryLocation transactionEntry={transactionEntry} />,
		)
		.with(
			{
				kind: "personal",
			},
			(transactionEntry) => <TransactionEntryPersonal transactionEntry={transactionEntry} />,
		)
		.with(
			{
				kind: "package",
			},
			(transactionEntry) => <TransactionEntryPackage transactionEntry={transactionEntry} />,
		)
		.exhaustive();
};
