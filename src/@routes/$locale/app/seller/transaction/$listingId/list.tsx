import { createFileRoute } from "@tanstack/react-router";
import { ListingTransactionListPage } from "~/seller/listing/ui/page/ListingTransactionListPage/ListingTransactionListPage";
import { ListingTransactionListPendingPage } from "~/seller/listing/ui/page/ListingTransactionListPendingPage";

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
