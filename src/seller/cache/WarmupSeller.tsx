import type { FC } from "react";
import { withDraftQuery } from "~/seller/draft/query/withDraftQuery";
import { withListingQuery as withSellerListingQuery } from "~/seller/listing/query/withListingQuery";
import { withTransactionListingQuery } from "~/seller/transaction-listing/query/withTransactionListingQuery";

export namespace WarmupSeller {
	export type Props = {};
}

export const WarmupSeller: FC<WarmupSeller.Props> = () => {
	withDraftQuery.useCollectionQuery({
		where: {
			usedAtIsNull: true,
		},
		cursor: {
			page: 0,
			size: 1,
		},
		sort: [
			{
				field: "updatedAt",
				order: "desc",
			},
		],
	});
	withDraftQuery.useCollectionQuery({
		where: {
			usedAtIsNull: true,
		},
		sort: [
			{
				field: "updatedAt",
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
			active: true,
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
			active: false,
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
