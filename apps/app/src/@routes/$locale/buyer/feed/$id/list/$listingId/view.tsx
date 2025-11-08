import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/$locale/buyer/feed/$id/list/$listingId/view",
)({
	component() {
		return "listing detail";
	},
});
