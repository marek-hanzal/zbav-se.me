import { useQueryClient } from "@tanstack/react-query";
import { FavouriteIcon, FavouriteOffIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { withFavouriteToggleMutation } from "@zbav-se.me/sdk/mutation/user";
import {
	withFeedFavouriteCollectionQuery,
	withListingFetchQuery,
	withListingMetricsFetchQuery,
} from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";

export namespace FavouriteToggleButton {
	export interface Props extends Button.Props {
		feedId: string;
		listingId: string;
	}
}

export const FavouriteToggleButton: FC<FavouriteToggleButton.Props> = ({
	feedId,
	listingId,
	ui,
	...props
}) => {
	const queryClient = useQueryClient();
	const patch = withListingFetchQuery.useSet();
	const favouriteToggle = withFavouriteToggleMutation.useMutation({
		onSuccess(listing) {
			patch(() => listing, {
				where: {
					id: listingId,
				},
			});
			withListingMetricsFetchQuery.invalidate(queryClient, listingId);
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
					label={"Loading... (button)"}
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
						label={
							listing.isFavourite
								? "Remove from favourite (button)"
								: "Add to favourite (button)"
						}
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
