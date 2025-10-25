import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/listing/my")({
	component() {
		return "my listing";
	},
});
