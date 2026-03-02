import { createFileRoute, redirect } from "@tanstack/react-router";
import { translator } from "@use-pico/common/translator";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import { FeedDefaultPendingPage } from "~/app/v0/@buyer-user/feed/page/FeedDefaultPendingPage";
import { getFeedDefaultCreate } from "~/app/v0/@buyer-user/feed/service/getFeedDefaultCreate";

export const Route = createFileRoute("/$locale/buyer/feed/default")({
	/**
	 * Simple stuff:
	 *
	 * - pick most recent feed (create a new one if not present)
	 * - redirect user to listings with that feedId
	 *
	 * The idea is to _ensure_ we've a feed a user _can_ customize
	 */
	async loader({ context: { queryClient }, params: { locale } }) {
		const feed =
			(await withFeedQuery
				.fetchFn({
					sort: [
						{
							field: "updatedAt",
							order: "desc",
						},
					],
				})
				/**
				 * We're getting 4o4, if the feed is not found
				 */
				.catch(() => undefined)) ??
			(await withFeedQuery.createFn(
				queryClient,
				getFeedDefaultCreate(translator.text("Feed name (default)")),
				[
					"collection",
					"count",
				],
			));

		throw redirect({
			to: "/$locale/buyer/feed/$id/list",
			params: {
				locale,
				id: feed.id,
			},
		});
	},
	pendingComponent: FeedDefaultPendingPage,
});
