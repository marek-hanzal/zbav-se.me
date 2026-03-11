import { createFileRoute } from "@tanstack/react-router";
import { ListingTransactionListPage } from "~/app/v0/@seller/transaction-listing/page/ListingTransactionListPage";
import { ListingTransactionListPendingPage } from "~/app/v0/@seller/transaction-listing/page/ListingTransactionListPendingPage";

export const Route = createFileRoute("/$locale/seller/transaction/$listingId/list")({
	pendingComponent: ListingTransactionListPendingPage,
	component() {
		const { listingId } = Route.useParams();

		return (
			<ListingTransactionListPage
				_suspense={"I know"}
				listingId={listingId}
			/>
		);
	},
});
