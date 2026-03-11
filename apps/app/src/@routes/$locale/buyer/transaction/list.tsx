import { createFileRoute } from "@tanstack/react-router";
import { TransactionListPage } from "~/app/@buyer/transaction/~public/TransactionListPage";

export const Route = createFileRoute("/$locale/buyer/transaction/list")({
	component: TransactionListPage,
});
