import { createFileRoute } from "@tanstack/react-router";
import {
	TransactionDetailPage,
	TransactionDetailPendingPage,
} from "~/client/@seller/transaction/~public/TransactionDetailPage";

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
