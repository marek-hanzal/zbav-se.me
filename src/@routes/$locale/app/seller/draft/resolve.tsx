import { createFileRoute, redirect } from "@tanstack/react-router";
import { withDraftQuery } from "~/seller/draft/query/withDraftQuery";
import { DraftEditorPage } from "~/seller/draft/ui/DraftEditorPage";

export const Route = createFileRoute("/$locale/app/seller/draft/resolve")({
	async loader({ context: { queryClient }, params: { locale } }) {
		const current = await withDraftQuery
			.ensureEntityQuery(queryClient, {
				sort: [
					{
						field: "updatedAt",
						order: "desc",
					},
				],
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
	pendingComponent: DraftEditorPage.Fallback,
});
