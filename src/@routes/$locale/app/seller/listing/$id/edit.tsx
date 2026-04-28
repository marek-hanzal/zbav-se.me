import { createFileRoute } from "@tanstack/react-router";
import { EditorPage } from "~/seller/listing/ui/EditorPage";

export const Route = createFileRoute("/$locale/app/seller/listing/$id/edit")({
	component() {
		return <EditorPage />;
	},
	pendingComponent: EditorPage.Fallback,
});
