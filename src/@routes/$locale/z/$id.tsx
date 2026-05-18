import { createFileRoute } from "@tanstack/react-router";
import { PublicListingPage } from "~/public/listing/ui/PublicListingPage";
import { PublicListingPagePending } from "~/public/listing/ui/PublicListingPagePending";

export const Route = createFileRoute("/$locale/z/$id")({
	component() {
		const { id } = Route.useParams();

		return (
			<PublicListingPage
				listingId={id}
				_suspense={"I know"}
			/>
		);
	},
	pendingComponent: PublicListingPagePending,
});
