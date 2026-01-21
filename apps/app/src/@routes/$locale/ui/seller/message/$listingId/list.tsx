import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/ui/seller/message/$listingId/list")({
	component() {
		return "bello!";
	},
});
