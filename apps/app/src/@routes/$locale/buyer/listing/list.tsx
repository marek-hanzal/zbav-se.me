import { createFileRoute } from "@tanstack/react-router";
import { translator } from "@use-pico/common/translator";
import { zListingQuery } from "@zbav-se.me/sdk/api/session";
import { SpinnerContainer } from "@zbav-se.me/ui/container";
import z from "zod";
import { ListingListContainer } from "~/app/feed/ui/ListingListContainer";

export const Route = createFileRoute("/$locale/buyer/listing/list")({
	validateSearch: z.object({
		scrollToListingId: z.string().optional(),
		query: zListingQuery.optional(),
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
		const { scrollToListingId, query } = Route.useSearch();

		return (
			<ListingListContainer
				query={{
					...query,
					/**
					 * Cursor is hardcoded, so only first 200 listings are fetched.
					 */
					cursor: {
						page: 0,
						size: 200,
					},
				}}
				scrollToListingId={scrollToListingId}
			/>
		);
	},
});
