import { createFileRoute, redirect } from "@tanstack/react-router";
import { withFeedFetchQuery } from "@zbav-se.me/sdk/query/user";
import { match } from "ts-pattern";

export const Route = createFileRoute("/$locale/dashboard")({
	async loader({ context: { user }, params: { locale } }) {
		throw await match(user.side)
			.with("seller", async () => {
				return redirect({
					to: "/$locale/seller",
					params: {
						locale,
					},
				});
			})
			.with("buyer", undefined, null, async () => {
				const feed = await withFeedFetchQuery.query({
					sort: [
						{
							field: "updatedAt",
							direction: "desc",
						},
					],
				});

				return redirect({
					to: "/$locale/buyer/listing/list",
					params: {
						locale,
					},
					search: feed
						? {
								// feedId: feed.id,
								query: feed.query,
							}
						: undefined,
				});
			})
			.exhaustive();
	},
});
