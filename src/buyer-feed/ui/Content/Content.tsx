import { type Ref, useMemo } from "react";
import { withFeedQuery } from "~/buyer-feed/query/withFeedQuery";
import { Empty } from "~/buyer-feed/ui/Content/Empty";
import { FilterEmpty } from "~/buyer-feed/ui/Content/FilterEmpty";
import { ListingList } from "~/buyer-feed/ui/ListingList/index";
import { withListingQuery } from "~/buyer-listing/query/withListingQuery";
import { withFallbackFn } from "~/ui/fn/withFallbackFn";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { EmptyState } from "~/ui/ui/EmptyState";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";

export namespace Content {
	export interface Props extends MarkSuspense.Props {
		feedId: string;
		scrollToId: string | undefined;
		sentinelRef: Ref<HTMLDivElement | null>;
	}
}

export const Content = withFallbackFn(
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
					checkFn() {
						return !anyListingCount;
					},
					renderFn() {
						return <Empty />;
					},
				},
				{
					checkFn() {
						return !currentListingCollection.length;
					},
					renderFn() {
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
