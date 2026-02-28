import { createFileRoute } from "@tanstack/react-router";
import { DraftEditPage } from "~/app/@seller-user/draft/page/DraftEditPage";

export const Route = createFileRoute("/$locale/seller/draft/$id/edit")({
	component() {
		const { id } = Route.useParams();

		return <DraftEditPage draftId={id} />;
	},
});
