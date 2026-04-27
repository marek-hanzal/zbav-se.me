import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/app/seller/listing/$id/edit")({
	component() {
		// const { id } = Route.useParams();

		return "<DraftEditPage draftId={id} />";
	},
});
