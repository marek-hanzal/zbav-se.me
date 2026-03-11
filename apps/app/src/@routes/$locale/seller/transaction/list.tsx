import { createFileRoute } from "@tanstack/react-router";
import { TransactionListingListPage } from "~/app/v0/@seller/transaction-listing/page/TransactionListingListPage";

export const Route = createFileRoute("/$locale/seller/transaction/list")({
	component: TransactionListingListPage,
});
