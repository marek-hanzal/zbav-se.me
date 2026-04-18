import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Typo } from "@/lib/client/typo";
import { withTransactionListingQuery } from "~/seller/transaction-listing/query/withTransactionListingQuery";
import type { TransactionListingFilterSchema } from "~/seller/transaction-listing/server/schema/TransactionListingFilterSchema";
import { TransactionListingList } from "./TransactionListingList";

export namespace ListGroup {
	export interface Props extends Container.Props {
		filter: TransactionListingFilterSchema.Type;
		label: string;
		refetchInterval: number;
		typoProps?: Typo.PropsEx;
	}
}

export const ListGroup: FC<ListGroup.Props> = ({
	filter,
	label,
	refetchInterval,
	typoProps,
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
			data-ui-layout="vertical-flex"
			data-ui-gap="default"
			{...props}
		>
			<Typo
				label={label}
				data-ui-font="bold"
				data-ui-text="lg"
				data-ui-color="text"
				className={"text-center"}
				{...typoProps}
			/>

			<TransactionListingList transactionListingIds={transactionListingCollection} />
		</Container>
	);
};
