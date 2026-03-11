import type { MarkSuspense } from "@use-pico/client/type";
import type { Container } from "@use-pico/client/ui/container";
import type { tTransactionQuery } from "@zbav-se.me/sdk/api/seller";
import type { FC } from "react";
import { Item } from "./Item";
import { TransactionListContainer } from "./TransactionListContainer";

export namespace TransactionList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		query: tTransactionQuery;
	}
}

export const TransactionList: FC<TransactionList.Props> = ({ _suspense, query, ...props }) => {
	return (
		<TransactionListContainer
			_suspense={_suspense}
			query={query}
			renderItem={(transactionId) => (
				<Item
					key={transactionId}
					data-id={transactionId}
					_suspense={_suspense}
					transactionId={transactionId}
				/>
			)}
			{...props}
		/>
	);
};
