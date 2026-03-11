import { createFileRoute } from "@tanstack/react-router";
import { TransactionListingListPage } from "~/app/@seller/transaction-listing/~public/TransactionListingListPage";
import { TransactionListingListPendingPage } from "~/app/@seller/transaction-listing/~public/TransactionListingListPendingPage";

export const Route = createFileRoute("/$locale/seller/transaction/list")({
	pendingComponent: TransactionListingListPendingPage,
	component() {
		return <TransactionListingListPage _suspense={"I know"} />;
	},
});
