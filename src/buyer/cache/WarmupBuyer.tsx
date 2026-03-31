import { type FC, useEffect } from "react";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import { withListingQuery as withBuyerListingQuery } from "~/buyer/listing/query/withListingQuery";
import { withTransactionQuery as withBuyerTransactionQuery } from "~/buyer/transaction/query/withTransactionQuery";

export namespace WarmupBuyer {
	export type Props = {};
}

export const WarmupBuyer: FC<WarmupBuyer.Props> = () => {
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

	return null;
};
