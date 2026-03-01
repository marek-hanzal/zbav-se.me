import { createFileRoute } from "@tanstack/react-router";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import { FeedSelectPage } from "~/app/@buyer-user/feed/page/FeedSelectPage";
import { feedCreateDefault } from "~/app/v0/@buyer-user/feed/service/feedCreateDefault";

export const Route = createFileRoute("/$locale/buyer/feed/select")({
	async loader({ context: { queryClient } }) {
		/**
		 * Use count for existence check. It's cheaper than loading a full feed object.
		 */
		const feedCount = await withFeedQuery.count({});
		if (feedCount.total === 0) {
			await feedCreateDefault({
				queryClient,
			});
		}
	},
	component: FeedSelectPage,
});
