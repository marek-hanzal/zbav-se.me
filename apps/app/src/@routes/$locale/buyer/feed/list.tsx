import { createFileRoute } from "@tanstack/react-router";
import { translator } from "@use-pico/common/translator";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import { FeedListPage } from "~/app/@buyer-user/feed/~public/FeedListPage";
import { FeedListPagePending } from "~/app/@buyer-user/feed/~public/FeedListPagePending";
import { getFeedDefaultCreate } from "~/app/v0/@buyer-user/feed/service/getFeedDefaultCreate";

export const Route = createFileRoute("/$locale/buyer/feed/list")({
	async loader({ context: { queryClient } }) {
		/**
		 * Use count for existence check. It's cheaper than loading a full feed object.
		 */
		const feedCount = await withFeedQuery.countFn({});
		if (feedCount.total === 0) {
			withFeedQuery.createFn(
				queryClient,
				getFeedDefaultCreate(translator.text("Feed name (default)")),
				[
					"collection",
					"count",
				],
			)
		}
	},
	component: FeedListPage,
	pendingComponent: FeedListPagePending,
});
