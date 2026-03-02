import { useQueryClient } from "@tanstack/react-query";
import { FavouriteIcon, FavouriteOffIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Button } from "@use-pico/client/ui/button";
import { withFavouriteToggleMutation } from "@zbav-se.me/sdk/mutation/buyer/favourite";
import { withFeedFavouriteQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import { withListingQuery } from "@zbav-se.me/sdk/query/buyer/listing";
import type { FC } from "react";

export namespace Data {
	export interface Props extends Button.Props, MarkSuspense.Props {
		feedId: string;
		listingId: string;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, feedId, listingId, ui, ...props }) => {
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
};
