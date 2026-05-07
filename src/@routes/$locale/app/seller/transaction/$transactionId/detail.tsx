import { createFileRoute } from "@tanstack/react-router";
import { TransactionDetailPage } from "~/seller/transaction/ui/TransactionDetailPage";
import { TransactionDetailPendingPage } from "~/seller/transaction/ui/TransactionDetailPage/TransactionDetailPendingPage";

export const Route = createFileRoute("/$locale/app/seller/transaction/$transactionId/detail")({
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
