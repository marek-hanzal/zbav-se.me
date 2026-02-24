import type { Container } from "@use-pico/client/ui/container";
import type { tTransactionQuery } from "@zbav-se.me/sdk/api/buyer-user";
import { type FC, Suspense } from "react";
import { TransactionItem } from "~/app/@buyer-user/transaction/ui/TransactionItem";
import { TransactionItemPending } from "~/app/@buyer-user/transaction/ui/TransactionItemPending";
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
				renderItem={(item) => (
					<Suspense
						key={item.id}
						fallback={<TransactionItemPending />}
					>
						<TransactionItem
							_suspense={"I know"}
							data-id={item.id}
							transactionId={item.id}
						/>
					</Suspense>
				)}
				{...props}
			/>
		</Suspense>
	);
};
