import { match } from "ts-pattern";
import { withFallbackFn } from "~/ui/fn/withFallbackFn";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import type { UserSideEnumSchema } from "~/user-event-contract/schema/UserSideEnumSchema";
import { withTransactionEntryQuery } from "~/user-transaction-entry/query/withTransactionEntryQuery";
import { Common } from "~/user-transaction-entry/ui/TransactionEntryList/Item/Common";
import { Gallery } from "~/user-transaction-entry/ui/TransactionEntryList/Item/Gallery";
import { Location } from "~/user-transaction-entry/ui/TransactionEntryList/Item/Location";
import { Package } from "~/user-transaction-entry/ui/TransactionEntryList/Item/Package";
import { Personal } from "~/user-transaction-entry/ui/TransactionEntryList/Item/Personal";
import { Text } from "~/user-transaction-entry/ui/TransactionEntryList/Item/Text";

export namespace Item {
	export interface Props extends MarkSuspense.Props {
		side: UserSideEnumSchema.Type;
		transactionEntryId: string;
	}
}

export const Item = withFallbackFn(({ _suspense, side, transactionEntryId }: Item.Props) => {
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
				kind: "status-interest",
			},
			{
				kind: "status-trade",
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
			(transactionEntry) => <Personal transactionEntry={transactionEntry} />,
		)
		.with(
			{
				kind: "package",
			},
			(transactionEntry) => <Package transactionEntry={transactionEntry} />,
		)
		.exhaustive();
}, SpinnerContainer);
