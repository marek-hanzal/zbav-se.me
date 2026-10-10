import type { FC } from "react";
import { withTransactionQuery } from "~/buyer-transaction/query/withTransactionQuery";
import type { TransactionWhereSchema } from "~/buyer-transaction/schema/TransactionWhereSchema";
import { TransactionList } from "~/buyer-transaction/ui/TransactionList/index";
import { Container } from "~/ui/ui/Container";
import { Typo } from "~/ui/ui/Typo";

export namespace ListGroup {
	export interface Props extends Container.Props {
		label: string;
		where: TransactionWhereSchema.Type;
		refetchInterval: number;
		typoProps?: Typo.PropsEx;
	}
}

export const ListGroup: FC<ListGroup.Props> = ({
	label,
	where,
	refetchInterval,
	typoProps,
	...props
}) => {
	const { data: transactionCollection } = withTransactionQuery.useIdsQuery(
		{
			where,
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
			data-ui={"ListGroup[Container]"}
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
