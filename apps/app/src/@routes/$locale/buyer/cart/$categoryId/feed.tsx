import { createFileRoute } from "@tanstack/react-router";
import { translator } from "@use-pico/common/translator";
import { SpinnerContainer } from "@zbav-se.me/ui/container";
import z from "zod";
import { ListingListContainer } from "~/app/feed/ui/ListingListContainer";

export const Route = createFileRoute("/$locale/buyer/cart/$categoryId/feed")({
	validateSearch: z.object({
		scrollToListingId: z.string().optional(),
	}),
	pendingComponent() {
		return (
			<SpinnerContainer
				statusProps={{
					textTitle: translator.text("Preparing cart feed (title)"),
				}}
			/>
		);
	},
	component() {
		const { scrollToListingId } = Route.useSearch();
		const { categoryId } = Route.useParams();

		return (
			<ListingListContainer
				query={{
					where: {
						categoryId,
					},
					/**
					 * Cursor is hardcoded, so only first 200 listings are fetched.
					 */
					cursor: {
						page: 0,
						size: 200,
					},
					sort: [
						{
							field: "expiresAt",
							direction: "desc",
						},
					],
				}}
				scrollToListingId={scrollToListingId}
			/>
		);
	},
});
