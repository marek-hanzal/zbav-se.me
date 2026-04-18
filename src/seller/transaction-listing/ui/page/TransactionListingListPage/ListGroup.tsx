import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Typo, type uiTypo } from "@/lib/client/typo";
import { withTransactionListingQuery } from "~/seller/transaction-listing/query/withTransactionListingQuery";
import type { TransactionListingFilterSchema } from "~/seller/transaction-listing/server/schema/TransactionListingFilterSchema";
import { TransactionListingList } from "./TransactionListingList";

export namespace ListGroup {
	export interface Props extends Container.Props {
		filter: TransactionListingFilterSchema.Type;
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
	...props
}) => {
	const { data: transactionListingCollection } = withTransactionListingQuery.useIdsQuery(
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
			data-ui={"ListGroup"}
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
					font: "bold",
					text: "lg",
					color: "text",
					...typoUi,
				}}
				className={"text-center"}
			/>

			<TransactionListingList transactionListingIds={transactionListingCollection} />
		</Container>
	);
};
