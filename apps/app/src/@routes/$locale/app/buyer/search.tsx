import { createFileRoute } from "@tanstack/react-router";
import { translator } from "@use-pico/common/translator";
import { withFeedQuery } from "~/client/@buyer/feed/query/withFeedQuery";
import { getFeedDefaultCreate } from "~/client/@buyer/feed/service/getFeedDefaultCreate";
import { SearchPage } from "~/client/@buyer/search/~public/SearchPage";
import { SearchPagePending } from "~/client/@buyer/search/~public/SearchPagePending";

export const Route = createFileRoute("/$locale/app/buyer/search")({
	async loader({ context: { queryClient } }) {
		return (
			(await withFeedQuery
				.ensureEntityQuery(queryClient, {
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
