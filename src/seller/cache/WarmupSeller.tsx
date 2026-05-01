import type { FC } from "react";
import { withListingQuery as withSellerListingQuery } from "~/seller/listing/query/withListingQuery";
import { withTransactionListingQuery } from "~/seller/transaction-listing/query/withTransactionListingQuery";

export namespace WarmupSeller {
	export type Props = {};
}

export const WarmupSeller: FC<WarmupSeller.Props> = () => {
	withTransactionListingQuery.useCollectionQuery({
		cursor: {
			page: 0,
			size: 1000,
		},
		filter: {
			flow: "seller-to-buyer",
		},
		sort: [
			{
				field: "lastAt",
				order: "desc",
			},
		],
	});
	withTransactionListingQuery.useCollectionQuery({
		cursor: {
			page: 0,
			size: 1000,
		},
		filter: {
			flow: "archived",
		},
		sort: [
			{
				field: "lastAt",
				order: "desc",
			},
		],
	});
	withTransactionListingQuery.useCollectionQuery({
		cursor: {
			page: 0,
			size: 1000,
		},
		filter: {
			flow: "buyer-to-seller",
		},
		sort: [
			{
				field: "lastAt",
				order: "desc",
			},
		],
	});
	withTransactionListingQuery.useCountQuery({});

	withSellerListingQuery.useCollectionQuery({
		cursor: {
			page: 0,
			size: 100,
		},
		sort: [
			{
				field: "createdAt",
				order: "desc",
			},
		],
	});

	return null;
};
