import { createFileRoute } from "@tanstack/react-router";
import { PublicListingUnavailablePage } from "~/public/listing/ui/PublicListingUnavailablePage";

export const Route = createFileRoute("/$locale/z/unavailable")({
	head() {
		return {
			meta: [
				{
					title: "Listing unavailable | zbav-se.me",
				},
				{
					name: "description",
					content: "The listing exists, but it is not currently available.",
				},
			],
		};
	},
	component() {
		return <PublicListingUnavailablePage />;
	},
});
