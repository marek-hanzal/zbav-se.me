import { createFileRoute } from "@tanstack/react-router";
import { DraftEditPage } from "~/app/@seller/draft/~public/DraftEditPage";

export const Route = createFileRoute("/$locale/app/seller/draft/$id/edit")({
	component() {
		const { id } = Route.useParams();

		return <DraftEditPage draftId={id} />;
	},
});
