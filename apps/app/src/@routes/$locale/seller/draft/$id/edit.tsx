import { createFileRoute } from "@tanstack/react-router";
import { DraftEditPage } from "~/app/v0/@seller-user/draft/page/DraftEditPage";
import { DraftEditPendingPage } from "~/app/v0/@seller-user/draft/page/DraftEditPendingPage";

export const Route = createFileRoute("/$locale/seller/draft/$id/edit")({
	pendingComponent: DraftEditPendingPage,
	component() {
		const { id } = Route.useParams();

		return (
			<DraftEditPage
				_suspense={"I know"}
				draftId={id}
			/>
		);
	},
});
