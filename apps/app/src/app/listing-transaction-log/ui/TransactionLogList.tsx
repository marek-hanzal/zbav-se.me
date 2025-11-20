import { Container } from "@use-pico/client/ui/container";
import type { tListingTransactionLogQuery, tUserSide } from "@zbav-se.me/sdk/api/user";
import { withListingTransactionLogCollectionQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";
import { TransactionLogItem } from "~/app/listing-transaction-log/ui/TransactionLogItem";

export namespace TransactionLogList {
	export interface Props extends Container.Props {
		side: tUserSide;
		query: tListingTransactionLogQuery;
	}
}

export const TransactionLogList: FC<TransactionLogList.Props> = ({
	side,
	query,
	tweak,
	...props
}) => {
	const listingTransactionLogCollectionQuery =
		withListingTransactionLogCollectionQuery.useSuspenseQuery(query);

	return (
		<Container
			ui={`TransactionLogList-${side}-root`}
			tweak={[
				tweak,
			]}
			{...props}
		>
			{listingTransactionLogCollectionQuery.data.data.map((item) => (
				<TransactionLogItem
					key={item.id}
					side={side}
					listingTransactionLog={item}
				/>
			))}
		</Container>
	);
};
