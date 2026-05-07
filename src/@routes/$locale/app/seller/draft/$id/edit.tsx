import { createFileRoute } from "@tanstack/react-router";
import { DraftEditorPage } from "~/seller/draft/ui/DraftEditorPage";

export const Route = createFileRoute("/$locale/app/seller/draft/$id/edit")({
	component() {
		const { id } = Route.useParams();

		return (
			<DraftEditorPage
				_suspense={"I know"}
				draftId={id}
			/>
		);
	},
	pendingComponent: DraftEditorPage.Fallback,
});
