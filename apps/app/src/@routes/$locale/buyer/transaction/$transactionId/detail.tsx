import { createFileRoute } from "@tanstack/react-router";
import { TransactionDetailPage } from "~/app/@buyer/transaction/~public/TransactionDetailPage";

export const Route = createFileRoute("/$locale/buyer/transaction/$transactionId/detail")({
	component() {
		const { transactionId } = Route.useParams();

		return <TransactionDetailPage transactionId={transactionId} />;
	},
});
