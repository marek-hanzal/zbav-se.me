import { createFileRoute, redirect } from "@tanstack/react-router";
import { DateTime } from "luxon";
import { withDraftQuery } from "~/seller/draft/query/withDraftQuery";
import { DraftEditor } from "~/seller/draft/ui/DraftEditPage/DraftEditor/DraftEditor";

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
