import { createFileRoute } from "@tanstack/react-router";
import { withListingTransactionFetchQuery } from "@zbav-se.me/sdk/query/session";

export const Route = createFileRoute("/$locale/buyer/transaction/$id")({
	async loader({ params: { id }, context: { queryClient } }) {
		await withListingTransactionFetchQuery.prefetch(queryClient, {
			where: {
				id,
			},
		});
	},
});
