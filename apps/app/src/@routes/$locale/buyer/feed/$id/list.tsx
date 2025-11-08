import { createFileRoute } from "@tanstack/react-router";
import { translator } from "@use-pico/common/translator";
import { SpinnerContainer } from "@zbav-se.me/ui/container";
import z from "zod";
import { ListingListContainer } from "~/app/feed/ui/ListingListContainer";

export const Route = createFileRoute("/$locale/buyer/feed/$id/list")({
	validateSearch: z.object({
		scrollToListingId: z.string().optional(),
	}),
	pendingComponent() {
		return (
			<SpinnerContainer
				statusProps={{
					textTitle: translator.text("Preparing feed (title)"),
				}}
			/>
		);
	},
	component() {
		const { id } = Route.useParams();
		const { scrollToListingId } = Route.useSearch();

		return (
			<ListingListContainer
				id={id}
				limit={200}
				scrollToListingId={scrollToListingId}
			/>
		);
	},
});
