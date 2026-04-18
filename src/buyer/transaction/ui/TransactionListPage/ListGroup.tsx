import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Typo, type uiTypo } from "@/lib/client/typo";
import type { TransactionFilterSchema } from "~/buyer/transaction/server/schema/TransactionFilterSchema";
import { withTransactionQuery } from "../../query/withTransactionQuery";
import { TransactionList } from "../TransactionList";

export namespace ListGroup {
	export interface Props extends Container.Props {
		label: string;
		filter: TransactionFilterSchema.Type;
		refetchInterval: number;
		typoUi?: uiTypo.Ui;
	}
}

export const ListGroup: FC<ListGroup.Props> = ({
	label,
	filter,
	refetchInterval,
	typoUi,
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
					text: "lg",
					font: "bold",
					...typoUi,
				}}
				className={"text-center"}
			/>

			<TransactionList transactionIds={transactionCollection} />
		</Container>
	);
};
