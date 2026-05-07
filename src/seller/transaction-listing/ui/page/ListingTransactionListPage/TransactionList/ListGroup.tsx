import type { FC } from "react";
import { Container } from "@/lib/client/container";
import type { MarkSuspense } from "@/lib/client/type";
import { Typo } from "@/lib/client/typo";
import { withTransactionQuery } from "~/seller/transaction/query/withTransactionQuery";
import type { TransactionFilterSchema } from "~/seller/transaction/server/schema/TransactionFilterSchema";
import { List } from "./List";

export namespace ListGroup {
	export interface Props extends Container.Props, MarkSuspense.Props {
		filter: TransactionFilterSchema.Type;
		label: string;
		refetchInterval: number;
		typoProps?: Typo.PropsEx;
	}
}

export const ListGroup: FC<ListGroup.Props> = ({
	_suspense,
	filter,
	label,
	refetchInterval,
	typoProps,
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
			data-ui-layout="vertical-flex"
			data-ui-gap="default"
			{...props}
		>
			<Typo
				label={label}
				data-ui-tone="neutral"
				data-ui-theme="light"
				data-ui-text="lg"
				data-ui-font="bold"
				data-ui-color="text"
				className={"text-center"}
				{...typoProps}
			/>

			<List
				_suspense={_suspense}
				transactionIds={transactionCollection}
			/>
		</Container>
	);
};
