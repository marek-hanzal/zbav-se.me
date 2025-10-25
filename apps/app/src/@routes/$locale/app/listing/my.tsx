import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/app/listing/my")({
	component() {
		return "my listing";
	},
});
