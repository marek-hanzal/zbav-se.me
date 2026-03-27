import { createFileRoute, redirect } from "@tanstack/react-router";
import { DateTime } from "luxon";
import { DraftEditor } from "~/client/@seller/draft/~public/DraftEditor";
import { withDraftQuery } from "~/client/@seller/draft/query/withDraftQuery";

export const Route = createFileRoute("/$locale/app/seller/draft/resolve")({
	async loader({ context: { queryClient }, params: { locale } }) {
		const current = await withDraftQuery
			.ensureEntityQuery(queryClient, {
				where: {
					updatedAtGte: DateTime.now()
						.minus({
							days: 3,
						})
						.toJSDate(),
					usedAtIsNull: true,
				},
			})
			.catch(() => undefined);

		if (current) {
			throw redirect({
				to: "/$locale/app/seller/draft/$id/edit",
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
			to: "/$locale/app/seller/draft/$id/edit",
			params: {
				id: draft.id,
				locale,
			},
		});
	},
	pendingComponent: DraftEditor.Fallback,
});
