import { createFileRoute, redirect } from "@tanstack/react-router";
import { SpinnerContainer } from "@/lib/client/spinner";
import { translator } from "@/lib/common/translation";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import { getFeedDefaultCreate } from "~/buyer/feed/service/getFeedDefaultCreate";

export const Route = createFileRoute("/$locale/app/buyer/feed/default")({
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
				.ensureEntityQuery(queryClient, {
					filter: {
						type: "user",
					},
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
			to: "/$locale/app/buyer/feed/$id/list",
			params: {
				locale,
				id: feed.id,
			},
		});
	},
	pendingComponent: SpinnerContainer,
});
