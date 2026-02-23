import { createFileRoute } from "@tanstack/react-router";
import { FeedFavouriteListPage } from "~/app/@buyer-user/feed/page/FeedFavouriteListPage";

export const Route = createFileRoute("/$locale/flow/buyer/feed/$id/favourite/list")({
	component() {
		const { id, locale } = Route.useParams();

		return (
			<FeedFavouriteListPage
				locale={locale}
				feedId={id}
			/>
		);
	},
});
