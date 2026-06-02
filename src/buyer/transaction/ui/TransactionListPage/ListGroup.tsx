import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Typo } from "@/lib/client/typo";
import { withTransactionQuery } from "../../query/withTransactionQuery";
import type { TransactionWhereSchema } from "../../server/schema/TransactionWhereSchema";
import { TransactionList } from "../TransactionList";

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
