import type { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tTransactionQuery } from "@zbav-se.me/sdk/api/buyer-user";
import { withTransactionCollectionQuery } from "@zbav-se.me/sdk/query/buyer-user/transaction";
import type { FC } from "react";
import { TransactionItem } from "~/app/@buyer-user/transaction/ui/TransactionItem";
import { TransactionListContainer } from "~/app/@common/transaction/ui/TransactionListContainer";

export namespace TransactionList {
	export interface Props extends Container.Props {
		query: tTransactionQuery;
	}
}

export const TransactionList: FC<TransactionList.Props> = ({ query, ...props }) => {
	return (
		<TransactionListContainer
			query={query}
			suspense={withTransactionCollectionQuery}
			emptyTitle={translator.text("No transactions as buyer (title)")}
			emptyMessage={translator.text("No transactions as buyer (message)")}
			emptyActionTo="/$locale/flow/buyer/feed/default"
			emptyActionLabel={translator.text("Go to my feed (button)")}
			renderItem={(item) => (
				<TransactionItem
					key={item.id}
					data-id={item.id}
					transactionId={item.id}
				/>
			)}
			{...props}
		/>
	);
};
