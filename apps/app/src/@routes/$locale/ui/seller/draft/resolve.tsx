import { createFileRoute, redirect } from "@tanstack/react-router";
import { withDraftCreateMutation } from "@zbav-se.me/sdk/mutation/user/draft";
import { withDraftFetchQuery } from "@zbav-se.me/sdk/query/user/draft";
import { DateTime } from "luxon";

export const Route = createFileRoute("/$locale/ui/seller/draft/resolve")({
	async loader({ context: { queryClient }, params: { locale } }) {
		const current = await withDraftFetchQuery.query({
			where: {
				updatedAtGte: DateTime.now()
					.minus({
						days: 3,
					})
					.toISO(),
			},
		});

		console.log(current);

		if (current) {
			throw redirect({
				to: "/$locale/ui/seller/draft/$id/edit",
				params: {
					id: current.id,
					locale,
				},
			});
		}

		const draft = await withDraftCreateMutation.mutate(queryClient, {});

		throw redirect({
			to: "/$locale/ui/seller/draft/$id/edit",
			params: {
				id: draft.id,
				locale,
			},
		});
	},
});
