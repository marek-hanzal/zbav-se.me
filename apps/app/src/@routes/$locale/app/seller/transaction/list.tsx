import { createFileRoute } from "@tanstack/react-router";
import { TransactionListingListPage } from "~/@seller/transaction-listing/~public/TransactionListingListPage";
import { TransactionListingListPendingPage } from "~/@seller/transaction-listing/~public/TransactionListingListPendingPage";

export const Route = createFileRoute("/$locale/app/seller/transaction/list")({
	pendingComponent: TransactionListingListPendingPage,
	component() {
		return <TransactionListingListPage _suspense={"I know"} />;
	},
});
