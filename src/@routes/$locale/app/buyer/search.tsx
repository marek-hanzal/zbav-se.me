import { createFileRoute } from "@tanstack/react-router";
import { translator } from "@/lib/common/translation";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import { getFeedDefaultCreate } from "~/buyer/feed/service/getFeedDefaultCreate";
import { SearchPage } from "~/buyer/search/ui/SearchPage/SearchPage";
import { SearchPagePending } from "~/buyer/search/ui/SearchPage/SearchPagePending";
import { withTranslationsQuery } from "~/common/translation/query/withTranslationsQuery";

export const Route = createFileRoute("/$locale/app/buyer/search")({
	async loader({ context: { queryClient }, params: { locale } }) {
		const t = translator({
			translations: await withTranslationsQuery.ensure(queryClient, {
				locale,
			}),
		});

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
				getFeedDefaultCreate(t.text("Search (title)"), "search"),
			))
		);
	},
	pendingComponent: SearchPagePending,
	component() {
		return <SearchPage _suspense={"I know"} />;
	},
});
