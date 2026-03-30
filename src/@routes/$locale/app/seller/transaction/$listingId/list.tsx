import { createFileRoute } from "@tanstack/react-router";
import { ListingTransactionListPage } from "~/seller/transaction-listing/~public/ListingTransactionListPage";
import { ListingTransactionListPendingPage } from "~/seller/transaction-listing/~public/ListingTransactionListPendingPage";

export const Route = createFileRoute("/$locale/app/seller/transaction/$listingId/list")({
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
