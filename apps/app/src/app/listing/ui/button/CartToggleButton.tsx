import { useQueryClient } from "@tanstack/react-query";
import { FavouriteIcon, FavouriteOffIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { withListingCartToggleMutation } from "@zbav-se.me/sdk/mutation/user";
import {
	withListingCartFeedCollectionQuery,
	withListingFetchQuery,
	withListingMetricsFetchQuery,
} from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";

export namespace CartToggleButton {
	export interface Props extends Button.Props {
		feedId: string;
		listingId: string;
	}
}

export const CartToggleButton: FC<CartToggleButton.Props> = ({
	feedId,
	listingId,
	ui,
	...props
}) => {
	const queryClient = useQueryClient();
	const listingCartToggle = withListingCartToggleMutation.useMutation({
		onSuccess() {
			withListingFetchQuery.invalidate(queryClient, {
				where: {
					id: listingId,
				},
			});
			withListingMetricsFetchQuery.invalidate(queryClient, listingId);
			withListingCartFeedCollectionQuery.invalidate(queryClient);
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
							listing.isInCart ? "Remove from cart (button)" : "Add to cart (button)"
						}
						iconEnabled={listing.isInCart ? FavouriteIcon : FavouriteOffIcon}
						disabled={listingCartToggle.isPending}
						loading={listingCartToggle.isPending}
						onClick={() =>
							listingCartToggle.mutate({
								feedId,
								listingId: listing.id,
								toggle: !listing.isInCart,
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
