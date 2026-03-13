import type { MarkSuspense } from "@use-pico/client/type";
import type {
	tListingQuery as tBuyerListingQuery,
	tTransactionQuery as tBuyerTransactionQuery,
	tFeedCountQuery,
	tFeedQuery,
} from "@zbav-se.me/sdk/api/buyer";
import type {
	tDraftQuery,
	tListingQuery as tSellerListingQuery,
	tTransactionListingQuery,
} from "@zbav-se.me/sdk/api/seller";
import type { tInboxCountQuery, tInboxQuery } from "@zbav-se.me/sdk/api/user";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import { withListingQuery as withBuyerListingQuery } from "@zbav-se.me/sdk/query/buyer/listing";
import { withTransactionQuery as withBuyerTransactionQuery } from "@zbav-se.me/sdk/query/buyer/transaction";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller/draft";
import { withListingQuery as withSellerListingQuery } from "@zbav-se.me/sdk/query/seller/listing";
import { withTransactionListingQuery } from "@zbav-se.me/sdk/query/seller/transaction-listing";
import { withInboxQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";
import { FEED_LIMIT } from "~/app/@common/limit/Limit";

export namespace WarmupCache {
	export interface Props extends MarkSuspense.Props {
		//
	}
}

export const WarmupCache: FC<WarmupCache.Props> = ({ _suspense }) => {
	/**
	 * Inbox warm-up
	 */
	{
		const query = {
			where: {
				priority: "high",
				archivedAtIsNull: true,
			},
		} satisfies tInboxCountQuery;
		const collectionQuery = {
			where: {
				priority: "high",
				archivedAtIsNull: true,
			},
			cursor: {
				page: 0,
				size: 1000,
			},
			sort: [
				{
					field: "timestamp",
					order: "desc",
				},
			],
		} satisfies tInboxQuery;

		withInboxQuery.useCountQuery(query);
		withInboxQuery.useCollectionQuery(collectionQuery);
	}

	/**
	 * Draft warm-up
	 */
	{
		const menuQuery = {
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
		} satisfies tDraftQuery;
		const query = {
			where: {
				usedAtIsNull: true,
			},
			sort: [
				{
					field: "updatedAt",
					order: "desc",
				},
			],
		} satisfies tDraftQuery;

		withDraftQuery.useCollectionQuery(menuQuery);
		withDraftQuery.useCollectionQuery(query);
		withDraftQuery.useCountQuery(query);
	}

	/**
	 * Feed warm-up
	 */
	{
		const query = {
			sort: [
				{
					field: "createdAt",
					order: "desc",
				},
			],
			filter: {
				type: "user",
			},
			cursor: {
				page: 0,
				size: FEED_LIMIT,
			},
		} satisfies tFeedQuery;
		const countQuery = {
			filter: {
				type: "user",
			},
		} satisfies tFeedCountQuery;

		withFeedQuery.useCollectionQuery(query);
		withFeedQuery.useCountQuery(countQuery);
	}

	/**
	 * Favourite warm-up
	 */
	{
		const query = {
			where: {
				isFavourite: true,
				withIgnored: false,
			},
			sort: [
				{
					field: "createdAt",
					order: "desc",
				},
			],
		} satisfies tBuyerListingQuery;

		withBuyerListingQuery.useCollectionQuery(query);
		withBuyerListingQuery.useCountQuery(query);
	}

	/**
	 * Buyer transaction warm-up
	 */
	{
		const query = {
			sort: [
				{
					field: "status",
					order: "asc",
				},
				{
					field: "createdAt",
					order: "desc",
				},
			],
		} satisfies tBuyerTransactionQuery;

		withBuyerTransactionQuery.useCollectionQuery(query);
		withBuyerTransactionQuery.useCountQuery({});
	}

	/**
	 * Seller transaction listing warm-up
	 */
	{
		const activeQuery = {
			filter: {
				active: true,
			},
			cursor: {
				page: 0,
				size: 1000,
			},
			sort: [
				{
					field: "lastAt",
					order: "desc",
				},
			],
		} satisfies tTransactionListingQuery;
		const inactiveQuery = {
			filter: {
				active: false,
			},
			cursor: {
				page: 0,
				size: 1000,
			},
			sort: [
				{
					field: "lastAt",
					order: "desc",
				},
			],
		} satisfies tTransactionListingQuery;
		withTransactionListingQuery.useCollectionQuery(activeQuery, {
			refetchInterval: 5_000,
		});

		withTransactionListingQuery.useCollectionQuery(inactiveQuery, {
			refetchInterval: 5_000,
		});

		withTransactionListingQuery.useCountQuery({});
	}

	/**
	 * My listing warm-up
	 */
	{
		const query = {
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
		} satisfies tSellerListingQuery;

		withSellerListingQuery.useCollectionQuery(query);
		withSellerListingQuery.useCountQuery({});
	}

	return null;
};
