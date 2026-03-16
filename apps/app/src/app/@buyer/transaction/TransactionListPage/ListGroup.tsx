import { Container } from "@use-pico/client/ui/container";
import { Typo, type uiTypo } from "@use-pico/client/ui/typo";
import type { tTransactionFilter } from "@zbav-se.me/sdk/api/buyer";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/buyer/transaction";
import type { FC } from "react";
import { TransactionList } from "../ui/TransactionList";

export namespace useCollection {
	export interface Props {
		filter: tTransactionFilter;
		refetchInterval: number;
	}
}

export const useCollection = ({ filter, refetchInterval }: useCollection.Props) => {
	return withTransactionQuery.useCollectionQuery(
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
};

export namespace ListGroup {
	export interface Props extends Container.Props {
		label: string;
		transactionIds: string[];
		typoUi?: uiTypo.Ui;
	}
}

export const ListGroup: FC<ListGroup.Props> = ({ label, transactionIds, typoUi, ui, ...props }) => {
	if (transactionIds.length === 0) {
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

			<TransactionList transactionIds={transactionIds} />
		</Container>
	);
};
