import { createFileRoute } from "@tanstack/react-router";
import { TransactionListingListPage } from "~/app/v0/@seller/transaction-listing/page/TransactionListingListPage";
import { TransactionListingListPendingPage } from "~/app/v0/@seller/transaction-listing/page/TransactionListingListPendingPage";

export const Route = createFileRoute("/$locale/seller/transaction/list")({
	pendingComponent: TransactionListingListPendingPage,
	component() {
		return <TransactionListingListPage _suspense={"I know"} />;
	},
});
