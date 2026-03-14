// import { useSuspenseQuery } from "@tanstack/react-query";
// import type { MarkSuspense } from "@use-pico/client/type";
// import type { tListingQuery as tBuyerListingQuery, tFeedQuery } from "@zbav-se.me/sdk/api/buyer";
// import type { tDraftQuery } from "@zbav-se.me/sdk/api/seller";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer/feed";

import { withListingQuery as withBuyerListingQuery } from "@zbav-se.me/sdk/query/buyer/listing";
// import { withTransactionQuery as withBuyerTransactionQuery } from "@zbav-se.me/sdk/query/buyer/transaction";
// import { withDraftQuery } from "@zbav-se.me/sdk/query/seller/draft";
// import { withListingQuery as withSellerListingQuery } from "@zbav-se.me/sdk/query/seller/listing";
// import { withTransactionQuery as withSellerTransactionQuery } from "@zbav-se.me/sdk/query/seller/transaction";
// import { withTransactionListingQuery } from "@zbav-se.me/sdk/query/seller/transaction-listing";
// import { withInboxQuery } from "@zbav-se.me/sdk/query/user";
// import type { FC } from "react";
// import { FEED_LIMIT } from "~/app/@common/limit/Limit";

import { useLocale } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { withCategoryQuery } from "@zbav-se.me/sdk/query/session";
import { withInboxQuery } from "@zbav-se.me/sdk/query/user/inbox";
import type { FC } from "react";

export namespace WarmupCache {
	export interface Props extends MarkSuspense.Props {
		//
	}
}

export const WarmupCache: FC<WarmupCache.Props> = ({ _suspense }) => {
	const locale = useLocale();

	/**
	 * Inbox warm-up
	 */
	{
		withInboxQuery.useCountQuery({
			where: {
				priority: "high",
				archivedAtIsNull: true,
			},
		});
		withInboxQuery.useCollectionQuery({
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
		});
	}

	/**
	 * Feed pre-warming
	 */
	{
		withFeedQuery.useEntityQuery({
			filter: {
				type: "search",
			},
			sort: [
				{
					field: "updatedAt",
					order: "desc",
				},
			],
		});
		withFeedQuery.useCountQuery({
			filter: {
				type: "user",
			},
		});
	}

	/**
	 * Buyer listing stuff
	 */
	{
		withBuyerListingQuery.useCountQuery({
            
        });
	}

	/**
	 * Collection pre-fetch
	 */
	{
		withCategoryQuery.useCollectionQuery({
			cursor: {
				page: 0,
				size: 1,
			},
		});
		withCategoryQuery.useCollectionQuery({
			cursor: {
				page: 0,
				size: 256,
			},
			filter: {
				locale,
			},
			sort: [
				{
					field: "sort",
					order: "asc",
				},
			],
		});
	}

	/**
	 * Draft warm-up
	 */
	// {
	// 	const query = {
	// 		where: {
	// 			usedAtIsNull: true,
	// 		},
	// 		sort: [
	// 			{
	// 				field: "updatedAt",
	// 				order: "desc",
	// 			},
	// 		],
	// 	} satisfies tDraftQuery;

	// 	withDraftQuery.useCollectionQuery({
	// 		where: {
	// 			usedAtIsNull: true,
	// 		},
	// 		cursor: {
	// 			page: 0,
	// 			size: 1,
	// 		},
	// 		sort: [
	// 			{
	// 				field: "updatedAt",
	// 				order: "desc",
	// 			},
	// 		],
	// 	});
	// 	withDraftQuery.useCollectionQuery(query);
	// 	withDraftQuery.useCountQuery(query);
	// }

	// /**
	//  * Feed warm-up
	//  */
	// {
	// 	const defaultFeedQuery = {
	// 		sort: [
	// 			{
	// 				field: "updatedAt",
	// 				order: "desc",
	// 			},
	// 		],
	// 		filter: {
	// 			type: "user",
	// 		},
	// 		cursor: {
	// 			page: 0,
	// 			size: 1,
	// 		},
	// 	} satisfies tFeedQuery;
	// 	const { data: defaultFeed } = useSuspenseQuery({
	// 		queryKey: [
	// 			"feed",
	// 			"fetch",
	// 			defaultFeedQuery,
	// 		],
	// 		queryFn() {
	// 			return withFeedQuery.fetchFn(defaultFeedQuery);
	// 		},
	// 	});
	// 	const defaultListingQuery: tBuyerListingQuery = defaultFeed?.query ?? {};
	// 	const defaultListingCollectionQuery: tBuyerListingQuery = {
	// 		...defaultListingQuery,
	// 		cursor: {
	// 			page: 0,
	// 			size: 256,
	// 		},
	// 	};

	// 	withFeedQuery.useCollectionQuery({
	// 		sort: [
	// 			{
	// 				field: "updatedAt",
	// 				order: "desc",
	// 			},
	// 		],
	// 		filter: {
	// 			type: "search",
	// 		},
	// 		cursor: {
	// 			page: 0,
	// 			size: 1,
	// 		},
	// 	});
	// 	withFeedQuery.useCollectionQuery({
	// 		sort: [
	// 			{
	// 				field: "createdAt",
	// 				order: "desc",
	// 			},
	// 		],
	// 		filter: {
	// 			type: "user",
	// 		},
	// 		cursor: {
	// 			page: 0,
	// 			size: FEED_LIMIT,
	// 		},
	// 	});
	// 	withFeedQuery.useCountQuery({
	// 		filter: {
	// 			type: "user",
	// 		},
	// 	});
	// 	withFeedQuery.useCountQuery({
	// 		filter: {
	// 			type: "search",
	// 		},
	// 	});
	// 	withBuyerListingQuery.useCollectionQuery(defaultListingCollectionQuery);
	// 	withBuyerListingQuery.useCountQuery(defaultListingQuery);
	// }

	// /**
	//  * Favourite warm-up
	//  */
	// {
	// 	withBuyerListingQuery.useCollectionQuery({
	// 		where: {
	// 			isFavourite: true,
	// 			withIgnored: false,
	// 		},
	// 		sort: [
	// 			{
	// 				field: "createdAt",
	// 				order: "desc",
	// 			},
	// 		],
	// 	});
	// 	withBuyerListingQuery.useCountQuery({
	// 		where: {
	// 			isFavourite: true,
	// 			withIgnored: false,
	// 		},
	// 	});
	// }

	// /**
	//  * Buyer transaction warm-up
	//  */
	// {
	// 	withBuyerTransactionQuery.useCollectionQuery({
	// 		sort: [
	// 			{
	// 				field: "status",
	// 				order: "asc",
	// 			},
	// 			{
	// 				field: "createdAt",
	// 				order: "desc",
	// 			},
	// 		],
	// 	});
	// 	withBuyerTransactionQuery.useCountQuery({});
	// }

	// /**
	//  * Seller transaction listing warm-up
	//  */
	// {
	// 	withSellerTransactionQuery.useCollectionQuery({
	// 		sort: [
	// 			{
	// 				field: "status",
	// 				order: "asc",
	// 			},
	// 			{
	// 				field: "updatedAt",
	// 				order: "desc",
	// 			},
	// 		],
	// 	});
	// 	withSellerTransactionQuery.useCountQuery({});

	// 	withTransactionListingQuery.useCollectionQuery({
	// 		filter: {
	// 			active: true,
	// 		},
	// 		cursor: {
	// 			page: 0,
	// 			size: 1000,
	// 		},
	// 		sort: [
	// 			{
	// 				field: "lastAt",
	// 				order: "desc",
	// 			},
	// 		],
	// 	});
	// 	withTransactionListingQuery.useCollectionQuery({
	// 		filter: {
	// 			active: false,
	// 		},
	// 		cursor: {
	// 			page: 0,
	// 			size: 1000,
	// 		},
	// 		sort: [
	// 			{
	// 				field: "lastAt",
	// 				order: "desc",
	// 			},
	// 		],
	// 	});
	// 	withTransactionListingQuery.useCountQuery({});
	// }

	// /**
	//  * My listing warm-up
	//  */
	// {
	// 	withSellerListingQuery.useCollectionQuery({
	// 		cursor: {
	// 			page: 0,
	// 			size: 100,
	// 		},
	// 		sort: [
	// 			{
	// 				field: "createdAt",
	// 				order: "desc",
	// 			},
	// 		],
	// 	});
	// 	withSellerListingQuery.useCountQuery({});
	// }

	return null;
};
