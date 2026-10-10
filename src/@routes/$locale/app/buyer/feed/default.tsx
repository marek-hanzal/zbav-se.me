import { createFileRoute, redirect } from "@tanstack/react-router";
import { withFeedQuery } from "~/buyer-feed/query/withFeedQuery";
import { getFeedDefaultCreateFn } from "~/buyer-feed/service/getFeedDefaultCreateFn";
import { translatorFn } from "~/translation/fn/translatorFn";
import { withTranslationsQuery } from "~/translation/query/withTranslationsQuery";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";

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
		const t = translatorFn({
			translations: await withTranslationsQuery.ensureFn(queryClient, {
				locale,
			}),
		});
		const feed =
			(await withFeedQuery
				.ensureEntityQueryFn(queryClient, {
					where: {
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
				getFeedDefaultCreateFn(t.textFn("Feed name (default)")),
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
