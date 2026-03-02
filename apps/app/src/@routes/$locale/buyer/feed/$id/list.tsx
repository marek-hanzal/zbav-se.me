import { createFileRoute } from "@tanstack/react-router";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import z from "zod";
import { FeedListPage } from "~/app/@buyer-user/feed/page/FeedListPage";
import { FeedListPagePending } from "~/app/@buyer-user/feed/page/FeedListPagePending";

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
		const feed = await withFeedQuery.patchFn(queryClient, {
			patch: {},
			query: {
				where: {
					id,
				},
			},
		});

		return {
			feed,
		};
	},
	pendingComponent: FeedListPagePending,
	component() {
		const { scrollToId } = Route.useSearch();
		const { feed } = Route.useLoaderData();

		return (
			<FeedListPage
				feed={feed}
				scrollToId={scrollToId}
			/>
		);
	},
});
