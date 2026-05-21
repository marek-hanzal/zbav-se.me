import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/z/unavailable")({
	component() {
		return "foo";
	},
});
