import { createFileRoute, redirect } from "@tanstack/react-router";
import { translator } from "@/lib/common/translator";
import { withListingQuery } from "~/seller/listing/query/withListingQuery";

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

		const listing = await withListingQuery.createFn(
			queryClient,
			{
				title: translator.text("New listing (title)"),
			},
			[
				"collection",
			],
		);

		throw redirect({
			to: "/$locale/app/seller/listing/$id/edit",
			params: {
				id: listing.id,
				locale,
			},
		});
	},
	// pendingComponent: DraftEditor.Fallback,
});
