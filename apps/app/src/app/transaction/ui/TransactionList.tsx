import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type { tTransactionQuery } from "@zbav-se.me/sdk/api/user";
import { withTransactionCollectionQuery } from "@zbav-se.me/sdk/query/user/transaction";
import { type FC, useId } from "react";
import { TransactionItem } from "~/app/transaction/ui/TransactionItem";

export namespace TransactionList {
	export interface Props extends Container.Props {
		locale: string;
		query: tTransactionQuery;
	}
}

export const TransactionList: FC<TransactionList.Props> = ({ locale, query, ui, ...props }) => {
	const transactionRootId = useId();

	return (
		<Container
			ui={{
				scroll: "vertical",
				height: "full",
				...ui,
			}}
			{...props}
		>
			<withTransactionCollectionQuery.Suspense
				data={query}
				fallback={<SpinnerContainer />}
			>
				{({ data: { data } }) => {
					return (
						<Container
							ui={{
								layout: "vertical-flex",
								gap: "default",
							}}
						>
							{data.map((transaction) => (
								<TransactionItem
									key={`${transactionRootId}-${transaction.id}`}
									data-id={transaction.id}
									transaction={transaction}
								/>
							))}
						</Container>
					);
				}}
			</withTransactionCollectionQuery.Suspense>
		</Container>
	);
};
