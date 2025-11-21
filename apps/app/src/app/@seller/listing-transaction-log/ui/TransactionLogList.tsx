import { Container } from "@use-pico/client/ui/container";
import type { tListingTransactionLogQuery } from "@zbav-se.me/sdk/api/user";
import { withListingTransactionLogCollectionQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";
import { TransactionLogItem } from "~/app/@seller/listing-transaction-log/ui/TransactionLogItem";

export namespace TransactionLogList {
	export interface Props extends Container.Props {
		query: tListingTransactionLogQuery;
	}
}

export const TransactionLogList: FC<TransactionLogList.Props> = ({ query, tweak, ...props }) => {
	const listingTransactionLogCollectionQuery =
		withListingTransactionLogCollectionQuery.useSuspenseQuery(query, {
			refetchInterval: 10_000,
		});

	return (
		<Container
			ui={"TransactionLogList-seller-root"}
			layout={"vertical-flex"}
			tweak={[
				tweak,
			]}
			height={"content"}
			gap={"md"}
			{...props}
		>
			{listingTransactionLogCollectionQuery.data.data.map((item) => (
				<TransactionLogItem
					key={item.id}
					listingTransactionLog={item}
				/>
			))}
		</Container>
	);
};
