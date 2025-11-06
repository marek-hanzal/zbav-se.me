import { createFileRoute } from "@tanstack/react-router";
import { withFeedFetchQuery } from "@zbav-se.me/sdk/query";

export const Route = createFileRoute("/$locale/buyer/feed/$id")({
	async loader({ params: { id }, context: { queryClient } }) {
		return {
			feed: await withFeedFetchQuery.ensure(queryClient, {
				where: {
					id,
				},
			}),
		};
	},
});
