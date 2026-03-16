import type { MarkSuspense } from "@use-pico/client/type";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { withFallback } from "@use-pico/client/utils";
import type { tUserSideEnum } from "@zbav-se.me/sdk/api/public";
import { withTransactionEntryQuery } from "@zbav-se.me/sdk/query/user/transaction-entry";
import { match } from "ts-pattern";
import { Common } from "./type/Common";
import { Gallery } from "./type/Gallery";
import { Location } from "./type/Location";
import { Package } from "./type/Package";
import { Personal } from "./type/Personal";
import { Text } from "./type/Text";

export namespace Item {
	export interface Props extends MarkSuspense.Props {
		side: tUserSideEnum;
		transactionEntryId: string;
	}
}

export const Item = withFallback(({ _suspense, side, transactionEntryId }: Item.Props) => {
	const { data: transactionEntry } = withTransactionEntryQuery.useFetchQuery(transactionEntryId);

	return match(transactionEntry)
		.with(
			{
				kind: "text",
			},
			(transactionEntry) => (
				<Text
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
				<Common
					side={side}
					transactionEntry={transactionEntry}
				/>
			),
		)
		.with(
			{
				kind: "gallery",
			},
			(transactionEntry) => (
				<Gallery
					_suspense={"I know"}
					transactionEntry={transactionEntry}
				/>
			),
		)
		.with(
			{
				kind: "location",
			},
			(transactionEntry) => (
				<Location
					_suspense={"I know"}
					transactionEntry={transactionEntry}
				/>
			),
		)
		.with(
			{
				kind: "personal",
			},
			(transactionEntry) => (
				<Personal
					_suspense={"I know"}
					transactionEntry={transactionEntry}
				/>
			),
		)
		.with(
			{
				kind: "package",
			},
			(transactionEntry) => <Package transactionEntry={transactionEntry} />,
		)
		.exhaustive();
}, SpinnerContainer);
