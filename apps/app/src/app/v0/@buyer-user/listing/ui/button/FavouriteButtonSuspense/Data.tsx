import { useQueryClient } from "@tanstack/react-query";
import { FavouriteIcon, FavouriteOffIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import { withFavouriteToggleMutation } from "@zbav-se.me/sdk/mutation/buyer-user/favourite";
import { withFeedFavouriteQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/buyer-user/listing";
import type { FC } from "react";

export namespace Data {
	export interface Props extends Button.Props, MarkSuspense.Props {
		feedId: string;
		listingId: string;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, feedId, listingId, ui, ...props }) => {
	const queryClient = useQueryClient();
	const patch = withListingFetchQuery.useSet();
	const { data: listing } = withListingFetchQuery.useSuspenseQuery({
		where: {
			id: listingId,
		},
	});
	const favouriteToggle = withFavouriteToggleMutation.useMutation({
		onSuccess(listing) {
			patch(() => listing, {
				where: {
					id: listingId,
				},
			});
			withFeedFavouriteQuery.invalidateCollection(queryClient);
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
		>
			<Tx
				label={
					listing.isFavourite
						? "Remove from favourite (button)"
						: "Add to favourite (button)"
				}
			/>
		</Button>
	);
};
