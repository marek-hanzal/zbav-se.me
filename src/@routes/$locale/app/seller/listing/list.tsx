import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/app/seller/listing/list")({
	component() {
		return "listing list page";
	},
});
