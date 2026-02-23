import { useQueryClient } from "@tanstack/react-query";
import { FavouriteIcon, FavouriteOffIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import { withFavouriteToggleMutation } from "@zbav-se.me/sdk/mutation/buyer-user/favourite";
import { withFeedFavouriteCollectionQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/buyer-user/listing";
import type { FC } from "react";

export namespace FavouriteButton {
	export interface Props extends Button.Props {
		feedId: string;
		listingId: string;
	}
}

export const FavouriteButton: FC<FavouriteButton.Props> = ({ feedId, listingId, ui, ...props }) => {
	const queryClient = useQueryClient();
	const patch = withListingFetchQuery.useSet();
	const favouriteToggle = withFavouriteToggleMutation.useMutation({
		onSuccess(listing) {
			patch(() => listing, {
				where: {
					id: listingId,
				},
			});
			withFeedFavouriteCollectionQuery.invalidate(queryClient);
		},
		meta: {
			mutationId: listingId,
		},
	});

	return (
		<withListingFetchQuery.Suspense
			data={{
				where: {
					id: listingId,
				},
			}}
			fallback={
				<Button
					label={translator.text("Loading... (button)")}
					disabled
					loading
					ui={{
						tone: "primary",
						theme: "light",
						size: "xl",
						justify: "start",
						...ui,
					}}
					{...props}
				/>
			}
		>
			{({ data: listing }) => {
				return (
					<Button
						label={translator.text(
							listing.isFavourite
								? "Remove from favourite (button)"
								: "Add to favourite (button)",
						)}
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
			}}
		</withListingFetchQuery.Suspense>
	);
};
