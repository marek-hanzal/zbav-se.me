import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/buyer/cart/$categoryId/feed")({
	component() {
		return "feed";
	},
});
