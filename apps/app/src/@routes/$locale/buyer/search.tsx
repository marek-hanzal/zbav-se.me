import { createFileRoute } from "@tanstack/react-router";
import { translator } from "@use-pico/common/translator";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import { SearchPage } from "~/app/@buyer/search/~public/SearchPage";
import { SearchPagePending } from "~/app/@buyer/search/~public/SearchPagePending";
import { getFeedDefaultCreate } from "~/app/@common/feed/service/getFeedDefaultCreate";

export const Route = createFileRoute("/$locale/buyer/search")({
	async loader({ context: { queryClient } }) {
		return (
			(await withFeedQuery
				.fetchFn({
					filter: {
						type: "search",
					},
					sort: [
						{
							field: "updatedAt",
							order: "desc",
						},
					],
				})
				.catch(() => undefined)) ??
			(await withFeedQuery.createFn(
				queryClient,
				getFeedDefaultCreate(translator.text("Search (title)"), "search"),
			))
		);
	},
	pendingComponent: SearchPagePending,
	component() {
		const feed = Route.useLoaderData();

		return <SearchPage feedId={feed.id} />;
	},
});
