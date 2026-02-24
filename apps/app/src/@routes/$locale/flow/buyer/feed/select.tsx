import { createFileRoute } from "@tanstack/react-router";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import { FeedSelectPage } from "~/app/@buyer-user/feed/page/FeedSelectPage";
import { feedCreateDefault } from "~/app/@buyer-user/feed/service/feedCreateDefault";

export const Route = createFileRoute("/$locale/flow/buyer/feed/select")({
	async loader({ context: { queryClient } }) {
		/**
		 * Dummy catch is intentional - we don't care about results here (not found throws an error).
		 */
		const feed = await withFeedQuery.fetch({}).catch(() => undefined);
		if (!feed) {
			await feedCreateDefault({
				queryClient,
			});
		}
	},
	component: FeedSelectPage,
});
