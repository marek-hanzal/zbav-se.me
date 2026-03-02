import { createFileRoute, redirect } from "@tanstack/react-router";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import { DateTime } from "luxon";

export const Route = createFileRoute("/$locale/seller/draft/resolve")({
	async loader({ context: { queryClient }, params: { locale } }) {
		const current = await withDraftQuery
			.fetchFn({
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
				to: "/$locale/seller/draft/$id/edit",
				params: {
					id: current.id,
					locale,
				},
			});
		}

		const draft = await withDraftQuery.createFn(queryClient, {}, [
			"collection",
		]);

		throw redirect({
			to: "/$locale/seller/draft/$id/edit",
			params: {
				id: draft.id,
				locale,
			},
		});
	},
	pendingComponent: SpinnerContainer,
});
