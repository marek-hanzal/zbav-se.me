import { createFileRoute } from "@tanstack/react-router";
import { FeedFavouriteListPage } from "~/app/v0/@buyer/feed/page/FeedFavouriteListPage";

export const Route = createFileRoute("/$locale/buyer/feed/$id/favourite/list")({
	component() {
		const { id } = Route.useParams();

		return <FeedFavouriteListPage feedId={id} />;
	},
});
