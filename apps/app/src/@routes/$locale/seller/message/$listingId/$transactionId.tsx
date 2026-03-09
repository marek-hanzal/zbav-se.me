import { createFileRoute } from "@tanstack/react-router";
import { TransactionDetailPage } from "~/app/@seller/transaction/~public/TransactionDetailPage";

export const Route = createFileRoute("/$locale/seller/message/$listingId/$transactionId")({
	component() {
		const { transactionId } = Route.useParams();

		return <TransactionDetailPage transactionId={transactionId} />;
	},
});
