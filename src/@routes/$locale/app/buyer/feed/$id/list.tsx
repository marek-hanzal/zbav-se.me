import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import { FeedListingPage } from "~/buyer/feed/ui/FeedListingPage/FeedListingPage";
import { FeedListingPagePending } from "~/buyer/feed/ui/FeedListingPage/FeedListingPagePending";

export const Route = createFileRoute("/$locale/app/buyer/feed/$id/list")({
	validateSearch: z.object({
		/**
		 * If needed, we can restore scroll position to a particular listing.
		 */
		scrollToId: z.string().optional(),
	}),
	async loader({ context: { queryClient }, params: { id } }) {
		/**
		 * This will force update "updatedAt" field, so we'll mark "this" feed as the "last visited" one.
		 */
		await withFeedQuery.patchFn(queryClient, {
			patch: {},
			query: {
				where: {
					id,
				},
			},
		});
	},
	pendingComponent: FeedListingPagePending,
	component() {
		const { scrollToId } = Route.useSearch();
		const { id } = Route.useParams();

		return (
			<FeedListingPage
				_suspense={"I know"}
				feedId={id}
				scrollToId={scrollToId}
			/>
		);
	},
});
