import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/buyer/feed/$id/favourite/list")({
	component() {
		// const { id } = Route.useParams();

		return "<FeedFavouriteListPage feedId={id} />";
	},
});
