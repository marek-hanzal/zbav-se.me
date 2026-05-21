import { createFileRoute } from "@tanstack/react-router";
import { ListingViewPage } from "~/buyer/listing/ui/ListingViewPage";
import { ListingViewPagePending } from "~/buyer/listing/ui/ListingViewPage/ListingViewPagePending";

export const Route = createFileRoute("/$locale/app/buyer/listing/$id/view")({
	pendingComponent: ListingViewPagePending,
	component() {
		const { id } = Route.useParams();

		return (
			<ListingViewPage
				_suspense={"I know"}
				listingId={id}
			/>
		);
	},
});
