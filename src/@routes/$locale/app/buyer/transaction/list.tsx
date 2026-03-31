import { createFileRoute } from "@tanstack/react-router";
import { TransactionListPage } from "~/buyer/transaction/ui/TransactionListPage";
import { TransactionListPendingPage } from "~/buyer/transaction/ui/TransactionListPage/TransactionListPendingPage";

export const Route = createFileRoute("/$locale/app/buyer/transaction/list")({
	pendingComponent: TransactionListPendingPage,
	component() {
		return <TransactionListPage _suspense={"I know"} />;
	},
});
