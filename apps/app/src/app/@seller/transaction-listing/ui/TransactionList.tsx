import type { Container } from "@use-pico/client/ui/container";
import type { tTransactionQuery } from "@zbav-se.me/sdk/api/seller";
import { type FC, Suspense } from "react";
import { Item } from "./Item";
import { TransactionListContainer } from "./TransactionListContainer";
import { TransactionListContainerPending } from "./TransactionListContainerPending";

export namespace TransactionList {
	export interface Props extends Container.Props {
		query: tTransactionQuery;
	}
}

export const TransactionList: FC<TransactionList.Props> = ({ query, ...props }) => {
	return (
		<Suspense fallback={<TransactionListContainerPending />}>
			<TransactionListContainer
				_suspense={"I know"}
				query={query}
				renderItem={(transactionId) => (
					<Item
						key={transactionId}
						data-id={transactionId}
						transactionId={transactionId}
					/>
				)}
				{...props}
			/>
		</Suspense>
	);
};
