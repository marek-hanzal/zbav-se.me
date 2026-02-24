import type { Container } from "@use-pico/client/ui/container";
import type { tTransactionQuery } from "@zbav-se.me/sdk/api/buyer-user";
import { type FC, Suspense } from "react";
import { TransactionItemSuspense } from "~/app/@buyer-user/transaction/ui/TransactionItemSuspense";
import { TransactionListContainer } from "~/app/@buyer-user/transaction/ui/TransactionListContainer";
import { TransactionListContainerPending } from "~/app/@buyer-user/transaction/ui/TransactionListContainerPending";

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
					<TransactionItemSuspense
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
