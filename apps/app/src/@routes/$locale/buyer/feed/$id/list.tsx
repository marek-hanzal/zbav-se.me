import { createFileRoute } from "@tanstack/react-router";
import { ListingListContainer } from "~/app/feed/ui/ListingListContainer";

export const Route = createFileRoute("/$locale/buyer/feed/$id/list")({
	component() {
		const { id } = Route.useParams();

		return <ListingListContainer id={id} />;
	},
});
