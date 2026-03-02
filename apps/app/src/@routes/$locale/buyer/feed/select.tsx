import { createFileRoute } from "@tanstack/react-router";
import { translator } from "@use-pico/common/translator";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import { FeedSelectPage } from "~/app/@buyer-user/feed/page/FeedSelectPage";
import { FeedSelectPagePending } from "~/app/@buyer-user/feed/page/FeedSelectPagePending";
import { getFeedDefaultCreate } from "~/app/v0/@buyer-user/feed/service/getFeedDefaultCreate";

export const Route = createFileRoute("/$locale/buyer/feed/select")({
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
			);
		}
	},
	component: FeedSelectPage,
	pendingComponent: FeedSelectPagePending,
});
