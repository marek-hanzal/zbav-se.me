import { createFileRoute } from "@tanstack/react-router";
import { ListingViewPage } from "~/app/v0/@seller-user/listing/page/ListingViewPage";

export const Route = createFileRoute("/$locale/seller/listing/$id/view")({
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
