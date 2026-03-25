import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { Typo, type uiTypo } from "@use-pico/client/ui/typo";
import type { tTransactionFilter } from "@zbav-se.me/sdk/api/seller";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/seller/transaction";
import type { FC } from "react";
import { List } from "./List";

export namespace ListGroup {
	export interface Props extends Container.Props, MarkSuspense.Props {
		filter: tTransactionFilter;
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
	ui,
	...props
}) => {
	const { data: transactionCollection } = withTransactionQuery.useCollectionQuery(
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
