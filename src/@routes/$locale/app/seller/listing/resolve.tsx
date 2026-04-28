import { createFileRoute, redirect } from "@tanstack/react-router";
import { withListingQuery } from "~/seller/listing/query/withListingQuery";
import { EditorPage } from "~/seller/listing/ui/EditorPage";

export const Route = createFileRoute("/$locale/app/seller/listing/resolve")({
	async loader({ context: { queryClient }, params: { locale } }) {
		const current = await withListingQuery
			.ensureEntityQuery(queryClient, {
				where: {
					status: "draft",
				},
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
				to: "/$locale/app/seller/listing/$id/edit",
				params: {
					id: current.id,
					locale,
				},
			});
		}

		throw redirect({
			to: "/$locale/app/seller/listing/category",
			params: {
				locale,
			},
		});
	},
	pendingComponent: EditorPage.Fallback,
});
