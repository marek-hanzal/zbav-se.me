import { Container } from "@use-pico/client/ui/container";
import { Typo, type uiTypo } from "@use-pico/client/ui/typo";
import type { tTransactionListingFilter } from "@zbav-se.me/sdk/api/seller";
import { withTransactionListingQuery } from "@zbav-se.me/sdk/query/seller/transaction-listing";
import type { FC } from "react";
import { TransactionListingList } from "./TransactionListingList";

export namespace ListGroup {
	export interface Props extends Container.Props {
		filter: tTransactionListingFilter;
		label: string;
		refetchInterval: number;
		typoUi?: uiTypo.Ui;
	}
}

export const ListGroup: FC<ListGroup.Props> = ({
	filter,
	label,
	refetchInterval,
	typoUi,
	ui,
	...props
}) => {
	const { data: transactionListingCollection } = withTransactionListingQuery.useCollectionQuery(
		{
			filter,
			cursor: {
				page: 0,
				size: 1000,
			},
			sort: [
				{
					field: "lastAt",
					order: "desc",
				},
			],
		},
		{
			refetchInterval,
		},
	);

	if (transactionListingCollection.length === 0) {
		return null;
	}

	return (
		<Container
			ui={{
				layout: "vertical-flex",
				gap: "default",
				...ui,
			}}
			{...props}
		>
			<Typo
				label={label}
				ui={{
					text: "sm",
					font: "bold",
					color: "lead",
					...typoUi,
				}}
				className={"text-center"}
			/>

			<TransactionListingList transactionListingIds={transactionListingCollection} />
		</Container>
	);
};
