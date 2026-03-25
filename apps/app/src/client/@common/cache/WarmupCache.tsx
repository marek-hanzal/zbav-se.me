import { useLocale } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { withTransactionQuery as withBuyerTransactionQuery } from "@zbav-se.me/sdk/query/buyer/transaction";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller/draft";
import { withListingQuery as withSellerListingQuery } from "@zbav-se.me/sdk/query/seller/listing";
import { withTransactionListingQuery } from "@zbav-se.me/sdk/query/seller/transaction-listing";
import { withCategoryQuery } from "@zbav-se.me/sdk/query/session";
import { withInboxQuery } from "@zbav-se.me/sdk/query/user/inbox";
import { type FC, useEffect } from "react";
import { withFeedQuery } from "~/client/@buyer/feed/withFeedQuery";
import { withListingQuery as withBuyerListingQuery } from "~/client/@buyer/listing/withListingQuery";

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
		withFeedQuery.useCollectionQuery({
			filter: {
				type: "user",
			},
			sort: [
				{
					field: "createdAt",
					order: "desc",
				},
			],
		});
		const { data: feed } = withFeedQuery.useMaybeEntityQuery({
			filter: {
				type: "user",
			},
			sort: [
				{
					field: "updatedAt",
					order: "desc",
				},
			],
		});
		withBuyerListingQuery.useCollectionQuery(feed?.query || {});
		withBuyerListingQuery.useCountQuery(feed?.query ?? {});

		const { data: search } = withFeedQuery.useMaybeEntityQuery({
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
		withBuyerListingQuery.useCollectionQuery(search?.query || {});
		withBuyerListingQuery.useCountQuery(search?.query || {});

		const update = withFeedQuery.useUpdate();

		// biome-ignore lint/correctness/useExhaustiveDependencies: Single-shot
		useEffect(() => {
			feed && update(feed);
			search && update(search);
		}, []);

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
		withBuyerListingQuery.useCollectionQuery({
			sort: [
				{
					field: "createdAt",
					order: "desc",
				},
			],
			where: {
				isFavourite: true,
				withIgnored: false,
			},
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
	{
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
	}

	/**
	 * Buyer transaction warm-up
	 */
	{
		withBuyerTransactionQuery.useCollectionQuery({
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
		});
	}

	/**
	 * Seller transaction listing
	 */
	{
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
	}

	/**
	 * My listing warm-up
	 */
	{
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
	}

	return null;
};
