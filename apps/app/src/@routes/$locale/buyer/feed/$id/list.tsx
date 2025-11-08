import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import { ListingListContainer } from "~/app/feed/ui/ListingListContainer";

export const Route = createFileRoute("/$locale/buyer/feed/$id/list")({
	validateSearch: z.object({
		scrollToListingId: z.string().optional(),
	}),
	component() {
		const { id } = Route.useParams();
		const { scrollToListingId } = Route.useSearch();

		return (
			<ListingListContainer
				id={id}
				scrollToListingId={scrollToListingId}
			/>
		);
	},
});
