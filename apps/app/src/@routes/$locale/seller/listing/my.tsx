import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/seller/listing/my")({
	component() {
		return "my listing";
	},
});
