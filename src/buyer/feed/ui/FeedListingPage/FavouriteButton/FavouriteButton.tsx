import { Button } from "@/lib/client/button";
import { withFallback } from "@/lib/client/fallback";
import { FavouriteIcon, FavouriteOffIcon } from "@/lib/client/icon";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { withFavouriteToggleMutation } from "~/buyer/favourite/mutation/withFavouriteToggleMutation";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import type { ListingMetaSchema } from "~/buyer/listing/server/schema/ListingMetaSchema";

export namespace FavouriteButton {
	export interface Props extends Button.Props, MarkSuspense.Props {
		feedId: string;
		listingId: string;
		meta: ListingMetaSchema.Type | undefined;
	}
}

export const FavouriteButton = withFallback(
	({ _suspense, feedId, listingId, meta, ui, ...props }: FavouriteButton.Props) => {
		const update = withListingQuery.useUpdate();
		const { data: listing } = withListingQuery.useFetchQuery(listingId);
		const favouriteToggle = withFavouriteToggleMutation.useMutation({
			onSuccess: update,
			meta: {
				mutationId: listingId,
			},
		});

		return (
			<Button
				data-ui={"FavouriteButton"}
				data-action={
					listing.isFavourite ? "remove listing from favourites" : "save listing"
				}
				iconEnabled={listing.isFavourite ? FavouriteIcon : FavouriteOffIcon}
				disabled={favouriteToggle.isPending}
				loading={favouriteToggle.isPending}
				onClick={() => {
					favouriteToggle.mutate({
						feedId,
						listingId: listing.id,
						toggle: !listing.isFavourite,
						meta,
					});
				}}
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
