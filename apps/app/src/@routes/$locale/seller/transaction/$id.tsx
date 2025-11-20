import { createFileRoute } from "@tanstack/react-router";
import { withListingTransactionFetchQuery } from "@zbav-se.me/sdk/query/user";

export const Route = createFileRoute("/$locale/seller/transaction/$id")({
	async loader({ params: { id }, context: { queryClient } }) {
		await withListingTransactionFetchQuery.prefetch(queryClient, {
			where: {
				id,
			},
			meta: {
				side: "seller",
			},
		});
	},
});
