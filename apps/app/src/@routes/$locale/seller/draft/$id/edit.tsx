import { createFileRoute } from "@tanstack/react-router";
import { DraftEditPage } from "~/app/@seller-user/draft/page/DraftEditPage";
import { DraftEditPendingPage } from "~/app/@seller-user/draft/page/DraftEditPendingPage";

export const Route = createFileRoute("/$locale/seller/draft/$id/edit")({
	pendingComponent: DraftEditPendingPage,
	component() {
		const { id } = Route.useParams();

		return <DraftEditPage draftId={id} />;
	},
});
