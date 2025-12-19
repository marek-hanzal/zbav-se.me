import { createFileRoute, redirect } from "@tanstack/react-router";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { withDraftCreateMutation } from "@zbav-se.me/sdk/mutation/user/draft";
import { withDraftCollectionQuery, withDraftFetchQuery } from "@zbav-se.me/sdk/query/user/draft";
import { DateTime } from "luxon";

export const Route = createFileRoute("/$locale/ui/seller/draft/resolve")({
	async loader({ context: { queryClient }, params: { locale } }) {
		const current = await withDraftFetchQuery
			.query({
				where: {
					updatedAtGte: DateTime.now()
						.minus({
							days: 3,
						})
						.toISO(),
					usedAtIsNull: true,
				},
			})
			.catch(() => undefined);

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
		await withDraftCollectionQuery.invalidate(queryClient);

		throw redirect({
			to: "/$locale/ui/seller/draft/$id/edit",
			params: {
				id: draft.id,
				locale,
			},
		});
	},
	pendingComponent: () => <SpinnerContainer />,
});
