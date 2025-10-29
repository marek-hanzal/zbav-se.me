import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/buyer/feed/select")({
	component() {
		return "select feed";
	},
});
