import type { FC } from "react";
import { withTransactionQuery } from "~/seller/transaction/query/withTransactionQuery";
import type { TransactionWhereSchema } from "~/seller/transaction/server/schema/TransactionWhereSchema";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import { Typo } from "~/ui/ui/Typo";
import { List } from "./List";

export namespace ListGroup {
	export interface Props extends Container.Props, MarkSuspense.Props {
		where: TransactionWhereSchema.Type;
		label: string;
		refetchInterval: number;
		typoProps?: Typo.PropsEx;
	}
}

export const ListGroup: FC<ListGroup.Props> = ({
	_suspense,
	where: filter,
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
			data-ui={"ListGroup[Container]"}
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
