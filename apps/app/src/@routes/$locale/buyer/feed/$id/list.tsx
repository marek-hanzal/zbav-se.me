import { createFileRoute } from "@tanstack/react-router";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import z from "zod";
import { FeedListingPage } from "~/app/@buyer/feed/~public/FeedListingPage";
import { FeedListingPagePending } from "~/app/@buyer/feed/~public/FeedListingPagePending";

export const Route = createFileRoute("/$locale/buyer/feed/$id/list")({
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
				feedId={id}
				scrollToId={scrollToId}
			/>
		);
	},
});
