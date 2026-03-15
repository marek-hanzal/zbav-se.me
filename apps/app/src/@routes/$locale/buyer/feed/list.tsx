import { createFileRoute } from "@tanstack/react-router";
import { translator } from "@use-pico/common/translator";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import { FeedListPage } from "~/app/@buyer/feed/~public/FeedListPage";
import { FeedListPagePending } from "~/app/@buyer/feed/~public/FeedListPagePending";
import { getFeedDefaultCreate } from "~/app/@common/feed/service/getFeedDefaultCreate";

export const Route = createFileRoute("/$locale/buyer/feed/list")({
	async loader({ context: { queryClient } }) {
		/**
		 * Use count for existence check. It's cheaper than loading a full feed object.
		 */
		const feedCount = await withFeedQuery.ensureCountQuery(queryClient, {
			filter: {
				type: "user",
			},
		});
		if (feedCount.total === 0) {
			withFeedQuery.createFn(
				queryClient,
				getFeedDefaultCreate(translator.text("Feed name (default)")),
				[
					"collection",
					"count",
				],
			);
		}
	},
	component: FeedListPage,
	/**
	 * We've loader here, don't remove!
	 */
	pendingComponent: FeedListPagePending,
});
