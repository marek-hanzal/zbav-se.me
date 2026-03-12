import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import type { tTransactionListingQuery } from "@zbav-se.me/sdk/api/seller";
import { withTransactionListingQuery } from "@zbav-se.me/sdk/query/seller/transaction-listing";
import type { FC } from "react";
import { Empty } from "./Empty";
import { Item } from "./Item";

export namespace TransactionListingList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		query: tTransactionListingQuery;
		refetchInterval?: number;
	}
}

export const TransactionListingList: FC<TransactionListingList.Props> = ({
	_suspense,
	query,
	refetchInterval = 5_000,
	ui,
	...props
}) => {
	const { data } = withTransactionListingQuery.useCollectionQuery(query, {
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
			{data.length > 0 ? (
				<Container
					ui={{
						layout: "vertical-flex",
						gap: "default",
					}}
				>
					{data.map((transactionListingId) => {
						return (
							<Item
								key={transactionListingId}
								data-id={transactionListingId}
								_suspense={_suspense}
								transactionListingId={transactionListingId}
							/>
						);
					})}
				</Container>
			) : (
				<Empty query={query} />
			)}
		</Container>
	);
};
