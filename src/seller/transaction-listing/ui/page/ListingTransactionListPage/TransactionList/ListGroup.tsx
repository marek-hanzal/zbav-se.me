import type { FC } from "react";
import { Container } from "@/lib/client/container";
import type { MarkSuspense } from "@/lib/client/type";
import { Typo, type uiTypo } from "@/lib/client/typo";
import { withTransactionQuery } from "~/seller/transaction/query/withTransactionQuery";
import type { TransactionFilterSchema } from "~/seller/transaction/server/schema/TransactionFilterSchema";
import { List } from "./List";

export namespace ListGroup {
	export interface Props extends Container.Props, MarkSuspense.Props {
		filter: TransactionFilterSchema.Type;
		label: string;
		refetchInterval: number;
		typoUi?: uiTypo.Ui;
	}
}

export const ListGroup: FC<ListGroup.Props> = ({
	_suspense,
	filter,
	label,
	refetchInterval,
	typoUi,
	...props
}) => {
	const { data: transactionCollection } = withTransactionQuery.useIdsQuery(
		{
			where: filter,
			cursor: {
				page: 0,
				size: 1000,
			},
			sort: [
				{
					field: "updatedAt",
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
					tone: "neutral",
					theme: "light",
					text: "lg",
					font: "bold",
					color: "text",
					...typoUi,
				}}
				className={"text-center"}
			/>

			<List
				_suspense={_suspense}
				transactionIds={transactionCollection}
			/>
		</Container>
	);
};
