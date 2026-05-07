import { createFileRoute } from "@tanstack/react-router";
import { TransactionDetailPage } from "~/buyer/transaction/ui/TransactionDetailPage";
import { TransactionDetailPendingPage } from "~/buyer/transaction/ui/TransactionDetailPage/TransactionDetailPendingPage";

export const Route = createFileRoute("/$locale/app/buyer/transaction/$transactionId/detail")({
	pendingComponent: TransactionDetailPendingPage,
	component() {
		const { transactionId } = Route.useParams();

		return (
			<TransactionDetailPage
				_suspense={"I know"}
				transactionId={transactionId}
			/>
		);
	},
});
