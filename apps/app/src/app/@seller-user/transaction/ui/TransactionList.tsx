import type { Container } from "@use-pico/client/ui/container";
import type { tTransactionQuery } from "@zbav-se.me/sdk/api/seller-user";
import { type FC, Suspense } from "react";
import { TransactionListContainer } from "~/app/@seller-user/transaction/ui/TransactionListContainer";
import { TransactionListContainerPending } from "~/app/@seller-user/transaction/ui/TransactionListContainerPending";
import { TransactionItemSuspense } from "~/app/@seller-user/transaction/ui/TransactionItemSuspense";

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
				renderItem={(item) => (
					<TransactionItemSuspense
						key={item.id}
						data-id={item.id}
						transactionId={item.id}
					/>
				)}
				{...props}
			/>
		</Suspense>
	);
};
