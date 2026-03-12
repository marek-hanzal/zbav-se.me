import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { EmptyState } from "@use-pico/client/ui/empty-state";
import type { tTransactionQuery } from "@zbav-se.me/sdk/api/seller";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/seller/transaction";
import type { FC } from "react";
import { Empty } from "./Empty";
import { Item } from "./Item";

export namespace TransactionList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		query: tTransactionQuery;
		refetchInterval?: number;
	}
}

export const TransactionList: FC<TransactionList.Props> = ({
	_suspense,
	query,
	refetchInterval = 5_000,
	ui,
	...props
}) => {
	const { data } = withTransactionQuery.useCollectionQuery(query, {
		refetchInterval,
	});

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
							return !data.length;
						},
						render() {
							return <Empty query={query} />;
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
					{data.map((transactionId) => {
						return (
							<Item
								key={transactionId}
								data-id={transactionId}
								_suspense={_suspense}
								transactionId={transactionId}
							/>
						);
					})}
				</Container>
			</EmptyState>
		</Container>
	);
};
