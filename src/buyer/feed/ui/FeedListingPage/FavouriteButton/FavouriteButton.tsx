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
	({ _suspense, feedId, listingId, meta, ...props }: FavouriteButton.Props) => {
		const { data: listing } = withListingQuery.useFetchQuery(listingId);
		const favouriteToggle = withFavouriteToggleMutation.useMutation({
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
				data-ui-tone="primary"
				data-ui-theme="light"
				data-ui-size="xl"
				data-ui-justify="start"
				data-ui-shadow={false}
				{...props}
			/>
		);
	},
	({ ...props }: Omit<FavouriteButton.Props, "_suspense">) => {
		return (
			<Button
				disabled
				loading
				data-ui-tone="secondary"
				data-ui-theme="light"
				data-ui-round="full"
				data-ui-square="md"
				data-ui-justify="center"
				data-ui-items="center"
				data-ui-size={undefined}
				data-ui-inner={undefined}
				data-ui-snap-to="top-right"
				data-ui-shadow={false}
				{...props}
			>
				<Tx label="Loading... (button)" />
			</Button>
		);
	},
);
