import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { EmptyState } from "@use-pico/client/ui/empty-state";
import { tTransactionStatusEnum } from "@zbav-se.me/sdk/api/seller";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/seller/transaction";
import type { FC } from "react";
import { toStatusLabel } from "~/app/@seller/transaction/~public/toStatusLabel";
import { Empty } from "./Empty";
import { ListGroup } from "./ListGroup";

export namespace TransactionList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		listingId: string;
		refetchInterval?: number;
	}
}

interface Group extends Partial<ListGroup.Props> {
	status: tTransactionStatusEnum;
}

const groups: Group[] = [
	{
		status: tTransactionStatusEnum.open,
	},
	{
		status: tTransactionStatusEnum.pending,
	},
	{
		status: tTransactionStatusEnum.dispute,
	},
	{
		status: tTransactionStatusEnum.resolved,
	},
	{
		status: tTransactionStatusEnum.success,
	},
	{
		status: tTransactionStatusEnum.rejected,
	},
	{
		status: tTransactionStatusEnum.sold,
	},
	{
		status: tTransactionStatusEnum.closed,
	},
	{
		status: tTransactionStatusEnum.expired,
	},
];

export const TransactionList: FC<TransactionList.Props> = ({
	_suspense,
	listingId,
	refetchInterval = 5_000,
	ui,
	...props
}) => {
	const { data: hasTransaction } = withTransactionQuery.useCollectionQuery(
		{
			where: {
				listingId,
			},
			cursor: {
				page: 0,
				size: 1,
			},
		},
		{
			refetchInterval,
		},
	);
	return (
		<Container
			ui={{
				scroll: "vertical",
				height: "full",
				...ui,
			}}
			{...props}
		>
			<EmptyState
				check={[
					{
						check() {
							return !hasTransaction.length;
						},
						render() {
							return <Empty />;
						},
					},
				]}
			>
				<Container
					ui={{
						layout: "vertical-flex",
						gap: "2xl",
					}}
				>
					{groups.map(({ status, ...props }) => {
						return (
							<ListGroup
								key={status}
								_suspense={_suspense}
								label={toStatusLabel(status)}
								filter={{
									listingId,
									status,
								}}
								refetchInterval={refetchInterval}
								{...props}
							/>
						);
					})}
				</Container>
			</EmptyState>
		</Container>
	);
};
