import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { EmptyState } from "@use-pico/client/ui/empty-state";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/seller/transaction";
import { type FC, Suspense } from "react";
import { Empty } from "./Empty";
import { Item } from "./Item";

export namespace TransactionList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		listingId: string;
		refetchInterval?: number;
	}
}

export const TransactionList: FC<TransactionList.Props> = ({
	_suspense,
	listingId,
	refetchInterval = 5_000,
	ui,
	...props
}) => {
	const { data: transactionCollection } = withTransactionQuery.useCollectionQuery(
		{
			where: {
				listingId,
			},
			cursor: {
				page: 0,
				size: 1000,
			},
			sort: [
				{
					field: "status",
					order: "asc",
				},
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
							return !transactionCollection.length;
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
						gap: "default",
					}}
				>
					{transactionCollection.map((transactionId) => {
						return (
							<Suspense
								key={transactionId}
								fallback={<Item.Fallback />}
							>
								<Item
									data-id={transactionId}
									_suspense={_suspense}
									transactionId={transactionId}
								/>
							</Suspense>
						);
					})}
				</Container>
			</EmptyState>
		</Container>
	);
};
