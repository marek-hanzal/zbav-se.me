import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/ui/seller/draft/$id/edit")({
	component() {
		return "editing draft, pyco";
	},
});
