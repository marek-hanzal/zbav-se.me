import { createFileRoute } from "@tanstack/react-router";
import { ListingTransactionListPage } from "~/app/@seller/transaction-listing/~public/ListingTransactionListPage";
import { ListingTransactionListPendingPage } from "~/app/@seller/transaction-listing/~public/ListingTransactionListPendingPage";

export const Route = createFileRoute("/$locale/seller/transaction/$listingId/list")({
	pendingComponent: ListingTransactionListPendingPage,
	component() {
		const { listingId } = Route.useParams();

		return <ListingTransactionListPage listingId={listingId} />;
	},
});
