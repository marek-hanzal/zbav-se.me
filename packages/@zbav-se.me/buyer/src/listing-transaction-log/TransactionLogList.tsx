import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { TransactionLogItem } from "@zbav-se.me/buyer/listing-transaction-log";
import type { tListingTransactionLogQuery } from "@zbav-se.me/sdk/api/user";
import { withListingTransactionLogCollectionQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";

export namespace TransactionLogList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		locale: string;
		query: tListingTransactionLogQuery;
	}
}

export const TransactionLogList: FC<TransactionLogList.Props> = ({
	_suspense,
	locale,
	query,
	tweak,
	...props
}) => {
	const listingTransactionLogCollectionQuery =
		withListingTransactionLogCollectionQuery.useSuspenseQuery(query, {
			refetchInterval: 10_000,
		});

	return (
		<Container
			ui={"TransactionLogList-buyer-root"}
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
					locale={locale}
				/>
			))}
		</Container>
	);
};
