import { useQueryClient } from "@tanstack/react-query";
import { FavouriteIcon, FavouriteOffIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import { withFallback } from "@use-pico/client/utils";
import { withFavouriteToggleMutation } from "@zbav-se.me/sdk/mutation/buyer/favourite";
import { withFeedFavouriteQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import { withListingQuery } from "@zbav-se.me/sdk/query/buyer/listing";

export namespace FavouriteButton {
	export interface Props extends Button.Props, MarkSuspense.Props {
		feedId: string;
		listingId: string;
	}
}

export const FavouriteButton = withFallback(
	({ _suspense, feedId, listingId, ui, ...props }: FavouriteButton.Props) => {
		const queryClient = useQueryClient();
		const update = withListingQuery.useUpdate();
		const { data: listing } = withListingQuery.useFetchQuery(listingId);
		const favouriteToggle = withFavouriteToggleMutation.useMutation({
			onSuccess(listing) {
				update(listing);
				withFeedFavouriteQuery.invalidator(queryClient, [
					"collection",
					"count",
				]);
			},
			meta: {
				mutationId: listingId,
			},
		});

		return (
			<Button
				data-ui={"FavouriteButton"}
				data-action={listing.isFavourite ? "remove listing from favourites" : "save listing"}
				iconEnabled={listing.isFavourite ? FavouriteIcon : FavouriteOffIcon}
				disabled={favouriteToggle.isPending}
				loading={favouriteToggle.isPending}
				onClick={() =>
					favouriteToggle.mutate({
						feedId,
						listingId: listing.id,
						toggle: !listing.isFavourite,
					})
				}
				ui={{
					tone: "primary",
					theme: "light",
					size: "xl",
					justify: "start",
					...ui,
				}}
				{...props}
			/>
		);
	},
	({ ui, ...props }: Omit<FavouriteButton.Props, "_suspense">) => {
		return (
			<Button
				disabled
				loading
				ui={{
					tone: "secondary",
					theme: "light",
					round: "full",
					square: "md",
					justify: "center",
					items: "center",
					size: undefined,
					inner: undefined,
					snapTo: "top-right",
					...ui,
				}}
				{...props}
			>
				<Tx label="Loading... (button)" />
			</Button>
		);
	},
);
