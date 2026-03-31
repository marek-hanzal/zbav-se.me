import { createFileRoute } from "@tanstack/react-router";
import { TransactionListingListPage } from "~/seller/transaction-listing/ui/page/TransactionListingListPage/TransactionListingListPage";
import { TransactionListingListPendingPage } from "~/seller/transaction-listing/ui/page/TransactionListingListPendingPage";

export const Route = createFileRoute("/$locale/app/seller/transaction/list")({
	pendingComponent: TransactionListingListPendingPage,
	component() {
		return <TransactionListingListPage _suspense={"I know"} />;
	},
});
