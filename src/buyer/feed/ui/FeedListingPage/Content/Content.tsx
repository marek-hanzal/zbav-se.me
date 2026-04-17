import { type Ref, useMemo } from "react";
import { EmptyState } from "@/lib/client/empty-state";
import { withFallback } from "@/lib/client/fallback";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import { ListingList } from "~/buyer/feed/ui/FeedListingPage/ListingList";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import { Empty } from "./Empty";
import { FilterEmpty } from "./FilterEmpty";

export namespace Content {
	export interface Props extends MarkSuspense.Props {
		feedId: string;
		scrollToId: string | undefined;
		sentinelRef: Ref<HTMLDivElement | null>;
	}
}

export const Content = withFallback(
	({ _suspense, feedId, scrollToId, sentinelRef }: Content.Props) => {
		const { data: feed } = withFeedQuery.useFetchQuery(feedId);
		const { data: anyListingCount } = withListingQuery.useCountQuery({});
		/**
		 * "useIdsQuery" - intentional, because we're practically pre-warming the query here
		 * for the real listing list to prevent firing duplicate queries.
		 */
		const { data: currentListingCollection } = withListingQuery.useIdsQuery({
			...feed.query,
			cursor: {
				page: 0,
				size: 256,
			},
		});

		const check = useMemo(() => {
			return [
				{
					check() {
						return !anyListingCount;
					},
					render() {
						return <Empty />;
					},
				},
				{
					check() {
						return !currentListingCollection.length;
					},
					render() {
						return <FilterEmpty />;
					},
				},
			] satisfies EmptyState.Check[];
		}, [
			anyListingCount,
			currentListingCollection,
		]);

		return (
			<EmptyState check={check}>
				<ListingList
					_suspense={"I know"}
					feedId={feedId}
					scrollToId={scrollToId}
					sentinelRef={sentinelRef}
				/>
			</EmptyState>
		);
	},
	SpinnerContainer,
);
