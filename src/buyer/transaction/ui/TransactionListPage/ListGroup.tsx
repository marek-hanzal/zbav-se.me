import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Typo } from "@/lib/client/typo";
import type { TransactionFilterSchema } from "~/buyer/transaction/server/schema/TransactionFilterSchema";
import { withTransactionQuery } from "../../query/withTransactionQuery";
import { TransactionList } from "../TransactionList";

export namespace ListGroup {
	export interface Props extends Container.Props {
		label: string;
		filter: TransactionFilterSchema.Type;
		refetchInterval: number;
		typoProps?: Typo.PropsEx;
	}
}

export const ListGroup: FC<ListGroup.Props> = ({
	label,
	filter,
	refetchInterval,
	typoProps,
	...props
}) => {
	const { data: transactionCollection } = withTransactionQuery.useIdsQuery(
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

	if (transactionCollection.length === 0) {
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
				data-ui-text="lg"
				data-ui-font="bold"
				className={"text-center"}
				{...typoProps}
			/>

			<TransactionList transactionIds={transactionCollection} />
		</Container>
	);
};
