import { match } from "ts-pattern";
import { withFallback } from "@/lib/client/fallback";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import type { UserSideEnumSchema } from "~/common/user-event/enum/UserSideEnumSchema";
import { withTransactionEntryQuery } from "~/user/transaction-entry/query/withTransactionEntryQuery";
import { Common } from "./type/Common";
import { Gallery } from "./type/Gallery";
import { Location } from "./type/Location";
import { Package } from "./type/Package";
import { Personal } from "./type/Personal";
import { Text } from "./type/Text";

export namespace Item {
	export interface Props extends MarkSuspense.Props {
		side: UserSideEnumSchema.Type;
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
