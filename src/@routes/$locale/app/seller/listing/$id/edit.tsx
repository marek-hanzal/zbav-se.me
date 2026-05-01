import { createFileRoute } from "@tanstack/react-router";
import { EditorPage } from "~/seller/listing/ui/EditorPage";

export const Route = createFileRoute("/$locale/app/seller/listing/$id/edit")({
	component() {
		const { id } = Route.useParams();

		return (
			<EditorPage
				_suspense={"I know"}
				listingId={id}
			/>
		);
	},
	pendingComponent: EditorPage.Fallback,
});
