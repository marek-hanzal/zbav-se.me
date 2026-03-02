import { createFileRoute } from "@tanstack/react-router";
import { ListingMessageListPage } from "~/app/v0/@seller/transaction-listing/page/ListingMessageListPage";
import { ListingMessageListPendingPage } from "~/app/v0/@seller/transaction-listing/page/ListingMessageListPendingPage";

export const Route = createFileRoute("/$locale/seller/message/$listingId/list")({
	pendingComponent: ListingMessageListPendingPage,
	component() {
		const { listingId } = Route.useParams();

		return (
			<ListingMessageListPage
				_suspense={"I know"}
				listingId={listingId}
			/>
		);
	},
});
