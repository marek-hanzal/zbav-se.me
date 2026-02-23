import type { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tTransactionQuery } from "@zbav-se.me/sdk/api/seller-user";
import { withTransactionCollectionQuery } from "@zbav-se.me/sdk/query/seller-user/transaction";
import type { FC } from "react";
import { TransactionListContainer } from "~/app/@common/transaction/ui/TransactionListContainer";
import { TransactionItem } from "~/app/@seller-user/transaction/ui/TransactionItem";

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
			emptyTitle={translator.text("No transactions as seller (title)")}
			emptyMessage={translator.text("No transactions as seller (message)")}
			emptyActionTo="/$locale/flow/seller/listing/my"
			emptyActionLabel={translator.text("Go to my listings (button)")}
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
