import { createFileRoute } from "@tanstack/react-router";
import {
	TransactionListPage,
	TransactionListPendingPage,
} from "~/app/@buyer/transaction/~public/TransactionListPage";

export const Route = createFileRoute("/$locale/app/buyer/transaction/list")({
	pendingComponent: TransactionListPendingPage,
	component() {
		return <TransactionListPage _suspense={"I know"} />;
	},
});
